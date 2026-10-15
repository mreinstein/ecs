import html from 'snabby'
import 'snabbdom-timeline'  // registers the <snabbdom-timeline> custom element


// In-page devtools panel for ecs. Renders a floating, collapsible overlay that
// graphs entity/component counts, filter matches, and per-system timing.
// inspired by ecsy https://blog.mozvr.com/ecsy-developer-tools/
//
// usage:
//   import { createDevtools } from 'ecs-devtools'
//   const devtools = createDevtools(world)
//
// this package doesn't import ecs. it only reads `world.stats`, which ecs (>= 0.24) keeps
// populated with the last completed frame's values.


/**
 * The subset of an ecs world the panel reads.
 * @typedef { Object } WorldStats
 * @prop {number} entityCount
 * @prop {{ [ componentName: string ]: number }} componentCount
 * @prop {{
 *   name: string;
 *   timeElapsed: number;
 *   filters: { [ filterId: string ]: number };
 * }[]} systems
 */

/**
 * @typedef { Object } World
 * @prop {WorldStats} stats
 */

/**
 * @typedef { Object } DevtoolsOptions
 * @prop {boolean} [open] start expanded. Defaults to the last persisted state, or true
 * @prop {string|false} [hotkey] key that toggles the panel. Default '`'. pass false to disable
 * @prop {number} [sampleRate] minimum milliseconds between samples. Default 250
 * @prop {number} [maxSamples] number of samples kept in each graph. Default 100
 * @prop {number} [width] initial panel width in pixels. Defaults to the last persisted width, or 420
 * @prop {string} [name] optional label shown in the panel header (handy with multiple worlds)
 * @prop {HTMLElement} [parent] element the panel is attached to. Default document.body
 */

/**
 * @typedef { Object } Devtools
 * @prop {() => void} open expand the panel
 * @prop {() => void} close collapse the panel
 * @prop {() => void} toggle toggle the panel
 * @prop {() => void} destroy remove the panel and detach from the world
 * @prop {HTMLElement} element the host element containing the panel's shadow root
 */


const STORAGE_KEY = 'mreinstein/ecs-devtools'
const MIN_WIDTH = 280

/** @type {WeakMap<World, Devtools>} */
const instances = new WeakMap()


/**
 * Attach a devtools panel to a world.
 * @param {World} world
 * @param {DevtoolsOptions} [options]
 * @returns {Devtools}
 */
export function createDevtools (world, options={}) {
    // re-attaching to the same world (e.g., hot module reload) replaces the old panel
    instances.get(world)?.destroy()

    const persisted = loadSettings()

    const settings = {
        hotkey: options.hotkey === undefined ? '`' : options.hotkey,
        sampleRate: options.sampleRate ?? 250,
        maxSamples: options.maxSamples ?? 100,
        name: options.name ?? '',
    }

    let isOpen = options.open ?? persisted.open ?? true
    let width = options.width ?? persisted.width ?? 420

    const model = createModel()

    let lastSampleTime = -Infinity
    let rafId = 0
    let destroyed = false


    // ---- DOM scaffolding (static parts are plain DOM, the dynamic body is snabby) ----

    const host = document.createElement('div')
    host.setAttribute('data-ecs-devtools', '')
    const shadow = host.attachShadow({ mode: 'open' })

    shadow.innerHTML = `<style>${CSS}</style>
        <div class="panel" part="panel">
            <div class="resize-handle" title="drag to resize"></div>
            <header>
                <button class="toggle" type="button"></button>
                <span class="title">ECS</span>
                <span class="name"></span>
                <span class="summary"></span>
            </header>
            <div class="body"><main></main></div>
        </div>`

    const panelEl   = /** @type {HTMLElement} */ (shadow.querySelector('.panel'))
    const toggleEl  = /** @type {HTMLElement} */ (shadow.querySelector('.toggle'))
    const headerEl  = /** @type {HTMLElement} */ (shadow.querySelector('header'))
    const summaryEl = /** @type {HTMLElement} */ (shadow.querySelector('.summary'))
    const handleEl  = /** @type {HTMLElement} */ (shadow.querySelector('.resize-handle'))
    const nameEl    = /** @type {HTMLElement} */ (shadow.querySelector('.name'))

    /** @type {any} */
    let currentVnode = shadow.querySelector('main')

    nameEl.textContent = settings.name

    if (settings.hotkey)
        toggleEl.title = `toggle (${settings.hotkey})`

    const parent = options.parent || document.body
    parent.appendChild(host)


    // ---- behavior ----

    function applyLayout () {
        panelEl.classList.toggle('collapsed', !isOpen)
        panelEl.style.width = isOpen ? `${clampWidth(width)}px` : ''
        toggleEl.textContent = isOpen ? '\u25B8' : '\u25C2'  // ▸ / ◂
    }

    function setOpen (open) {
        if (destroyed || open === isOpen)
            return
        isOpen = open
        applyLayout()
        saveSettings({ open: isOpen, width })
        renderPanel()  // rendering is skipped while collapsed, so catch up
    }

    const toggle = () => setOpen(!isOpen)

    headerEl.addEventListener('click', toggle)

    function onKeyDown (ev) {
        if (!settings.hotkey || ev.key !== settings.hotkey)
            return
        if (ev.ctrlKey || ev.metaKey || ev.altKey || isEditable(ev.composedPath()[0]))
            return
        ev.preventDefault()
        toggle()
    }

    window.addEventListener('keydown', onKeyDown)


    // drag the left edge to resize
    handleEl.addEventListener('pointerdown', function (ev) {
        if (!isOpen)
            return
        ev.preventDefault()
        handleEl.setPointerCapture(ev.pointerId)
        panelEl.classList.add('resizing')

        const startX = ev.clientX
        const startWidth = panelEl.offsetWidth

        const onMove = (e) => {
            width = clampWidth(startWidth + (startX - e.clientX))
            panelEl.style.width = `${width}px`
        }

        const onUp = () => {
            handleEl.removeEventListener('pointermove', onMove)
            handleEl.removeEventListener('pointerup', onUp)
            handleEl.removeEventListener('pointercancel', onUp)
            panelEl.classList.remove('resizing')
            saveSettings({ open: isOpen, width })
        }

        handleEl.addEventListener('pointermove', onMove)
        handleEl.addEventListener('pointerup', onUp)
        handleEl.addEventListener('pointercancel', onUp)
    })


    // ---- update loop ----
    // the panel polls world.stats on its own; ecs knows nothing about devtools. world.stats always
    // holds the last completed frame (cleanup() publishes it), so it's safe to read at any time.
    // requestAnimationFrame pauses in hidden tabs, so a backgrounded page costs nothing.

    function tick (now) {
        rafId = requestAnimationFrame(tick)

        if (now - lastSampleTime < settings.sampleRate)
            return
        lastSampleTime = now

        // keep sampling while collapsed so the graphs have history when the panel is expanded
        sample(model, world.stats, settings.maxSamples)
        summaryEl.textContent = `${world.stats.entityCount} entities`

        renderPanel()
    }

    function renderPanel () {
        if (!isOpen || destroyed)
            return

        currentVnode = html.update(currentVnode, render(model))
    }


    applyLayout()
    renderPanel()
    rafId = requestAnimationFrame(tick)


    /** @type {Devtools} */
    const instance = {
        open: () => setOpen(true),
        close: () => setOpen(false),
        toggle,
        destroy () {
            if (destroyed)
                return
            destroyed = true
            cancelAnimationFrame(rafId)
            window.removeEventListener('keydown', onKeyDown)
            host.remove()
            if (instances.get(world) === instance)
                instances.delete(world)
        },
        element: host,
    }

    instances.set(world, instance)

    return instance
}


export default createDevtools


// ---------------------------------------------------------------------------
// model
// ---------------------------------------------------------------------------

function createModel () {
    return {
        startTime: performance.now(),

        entityCount: 0,
        entityTimeline: createTimeline('Entity Count'),

        totalUniqueComponentTypes: 0,
        componentTimeline: createTimeline('Components Count'),

        // key is component name, value is { instanceCount, timeline }
        components: { },

        /*
        example system:
            {
                filters: {
                    'hero,rigidBody,facing': 1,
                    'transform,pointLight': 21
                },
                name: "lightSystem",
                timeElapsed: 0.025000001187436283
            }
        */
        systems: [ ],
    }
}


// the `graphs` array rendered by a <snabbdom-timeline> element. Mutated in place as samples
// arrive; the array reference stays stable for the lifetime of the timeline.
function createTimeline (title) {
    return [
        {
            title,  // accessible name for the graph
            label: '',
            type: 'linePlot',  // scatterPlot | linePlot
            linePlotAreaColor: 'rgba(41, 147, 251, 0.3)', // color to fill area in linePlot mode
            timeRange: { start: 0, end: 0 },  // seconds
            yRange: { start: 0, end: 10 },
            height: 40,              // pixels
            dataColor: 'dodgerblue', // color of data points on the graph
            renderTicks: false,
            renderValueLabel: false,
            data: [ ],
        }
    ]
}


// append a sample to a timeline, trimming old samples and re-fitting the axes
function pushSample (graphs, t, value, maxSamples) {
    const graph = graphs[0]

    graph.data.push({ t, value })
    if (graph.data.length > maxSamples)
        graph.data.splice(0, graph.data.length - maxSamples)

    let max = 0
    for (const p of graph.data)
        if (p.value > max)
            max = p.value

    graph.timeRange.start = graph.data[0].t
    graph.timeRange.end = t
    graph.yRange.end = Math.max(10, Math.ceil(max * 1.1))
    graph.label = String(value)
}


/**
 * @param {ReturnType<typeof createModel>} model
 * @param {WorldStats} stats
 * @param {number} maxSamples
 */
function sample (model, stats, maxSamples) {
    const t = (performance.now() - model.startTime) / 1000

    model.entityCount = stats.entityCount
    pushSample(model.entityTimeline, t, stats.entityCount, maxSamples)

    let totalCount = 0
    for (const componentId in stats.componentCount) {
        const count = stats.componentCount[componentId]
        totalCount += count

        if (!model.components[componentId])
            model.components[componentId] = { instanceCount: 0, timeline: createTimeline(componentId) }

        const c = model.components[componentId]
        c.instanceCount = count
        pushSample(c.timeline, t, count, maxSamples)
    }

    model.totalUniqueComponentTypes = Object.keys(stats.componentCount).length
    pushSample(model.componentTimeline, t, totalCount, maxSamples)

    // cleanup() overwrites these in place every frame, so snapshot them rather than keep references.
    // only the public (last completed frame) fields are read; the _ prefixed ones are in-progress.
    model.systems = stats.systems.map((s) => ({
        name: s.name,
        timeElapsed: s.timeElapsed,
        filters: { ...s.filters },
    }))
}


// ---------------------------------------------------------------------------
// views
// ---------------------------------------------------------------------------

// <snabbdom-timeline> renders its own children and measures its own width. `graphs` is set
// once (the array is stable), and update() tells the element to redraw after new samples.
// the element batches renders per animation frame.
function timelineView (graphs) {
    return html`<snabbdom-timeline class="timeline" renderer="canvas"
        @props:graphs=${graphs}
        @hook:postpatch=${redrawTimeline}></snabbdom-timeline>`
}


function redrawTimeline (oldVnode, vnode) {
    vnode.elm.update()
}


function systemColor (i, count) {
    return `hsl(${Math.round(i * (360 / count))}, 100%, 50%)`
}


function filterComponentsView (filterId) {
    return filterId.split(',').map((c) => html`<div class="filter-component">${c}</div>`)
}


function componentGraphsView (components) {
    return Object.keys(components).map((componentId) => {
        const c = components[componentId]
        return html`<div class="component-graph-row" @key=${componentId}>
            <div class="component-name" title="${componentId}">${componentId}</div>
            ${timelineView(c.timeline)}
        </div>`
    })
}


function filtersView (systems) {
    // get all unique filters
    const filters = { }

    for (const s of systems)
        for (const f of Object.keys(s.filters))
            filters[f] = s.filters[f]

    const filterViews = Object.keys(filters)
        .filter((f) => filters[f] > 0)
        .map((f) => html`<div class="filter" @key=${f}>
            <div class="filter-components">${filterComponentsView(f)}</div>
            <div>${filters[f]}</div>
        </div>`)

    return html`<section class="filters">
        <h3>Filters (${Object.keys(filters).length})</h3>
        ${filterViews}
    </section>`
}


function systemsOverviewGraphView (systems, totalTime) {
    const segments = [ ]
    const significant = [ ]

    if (totalTime > 0) {
        // total of all preceding segments length, used in the stroke-dashoffset calculation
        let totalPercent = 0

        for (let i = 0; i < systems.length; i++) {
            const system = systems[i]
            const percent = Math.floor(system.timeElapsed / totalTime * 100)

            if (percent === 0)
                continue

            const strokeColor = systemColor(i, systems.length)

            if (percent > 3)
                significant.push({ name: system.name, percent, strokeColor })

            segments.push(html`<circle class="donut-segment" cx="21" cy="21" r="15.91549430918954" fill="transparent" stroke="${strokeColor}" stroke-width="3" stroke-dasharray="${percent} ${100 - percent}" stroke-dashoffset="${-totalPercent}"><title>${system.name}</title></circle>`)

            totalPercent += percent
        }
    }

    return html`<div class="donut">
        <svg width="110px" height="110px" viewBox="0 0 42 42" xmlns="http://www.w3.org/2000/svg">
            <circle class="donut-hole" cx="21" cy="21" r="15.91549430918954" fill="#fff"/>
            <circle class="donut-ring" cx="21" cy="21" r="15.91549430918954" fill="transparent" stroke="#e2e3e4" stroke-width="3"/>
            ${segments}
        </svg>
        <div class="donut-legend">
            ${significant.map((s) => html`<div class="donut-legend-row">
                <div class="swatch" style="background-color: ${s.strokeColor}"></div>
                <div>${s.percent}% ${s.name}</div>
            </div>`)}
        </div>
    </div>`
}


function systemsView (systems) {
    let totalTime = 0
    for (const s of systems)
        totalTime += s.timeElapsed

    const systemViews = systems.map((s, i) => {
        const percent = totalTime > 0 ? Math.round(s.timeElapsed / totalTime * 100) : 0

        const filterViews = Object.keys(s.filters).map((f) => html`<div class="filter" @key=${f}>
            <div class="filter-components">
                <div class="filter-label">FILTER:</div>
                ${filterComponentsView(f)}
            </div>
            <div>${s.filters[f]}</div>
        </div>`)

        return html`<div class="system" @key=${i + ':' + s.name}>
            <div class="system-name" style="border-left-color: ${systemColor(i, systems.length)}">${s.name}</div>
            <div class="system-time">${s.timeElapsed.toFixed(2)}ms</div>
            <div class="system-percent">${percent}%</div>
            <div class="system-filters">${filterViews}</div>
        </div>`
    })

    return html`<section class="systems">
        <h3>Systems (${systems.length})</h3>
        <p>Total Time: ${totalTime.toFixed(2)}ms</p>
        ${systemsOverviewGraphView(systems, totalTime)}
        ${systemViews}
    </section>`
}


function render (model) {
    return html`<main>
        <section class="entities">
            <h2>Entities (${model.entityCount})</h2>
            ${timelineView(model.entityTimeline)}
        </section>

        <section class="components">
            <h2>Components (${model.totalUniqueComponentTypes})</h2>
            ${timelineView(model.componentTimeline)}
            ${componentGraphsView(model.components)}
        </section>

        ${filtersView(model.systems)}

        ${systemsView(model.systems)}
    </main>`
}


// ---------------------------------------------------------------------------
// helpers
// ---------------------------------------------------------------------------

function clampWidth (w) {
    return Math.round(Math.max(MIN_WIDTH, Math.min(w, window.innerWidth * 0.95)))
}


function isEditable (el) {
    if (!el || !(el instanceof HTMLElement))
        return false
    return el.isContentEditable || /^(INPUT|TEXTAREA|SELECT)$/.test(el.tagName)
}


function loadSettings () {
    try {
        return JSON.parse(localStorage.getItem(STORAGE_KEY) || '{}')
    } catch (err) {
        return { }
    }
}


function saveSettings (s) {
    try {
        localStorage.setItem(STORAGE_KEY, JSON.stringify(s))
    } catch (err) { }
}


// ---------------------------------------------------------------------------
// styles (scoped to the panel's shadow root)
// ---------------------------------------------------------------------------

const CSS = `
:host {
    all: initial;
}

.panel {
    position: fixed;
    top: 0;
    right: 0;
    height: 100vh;
    z-index: 2147483647;
    display: flex;
    flex-direction: column;
    box-sizing: border-box;
    background: #f3f4f5;
    color: #222;
    font: 12px/1.4 system-ui, -apple-system, 'Segoe UI', Roboto, Helvetica, Arial, sans-serif;
    box-shadow: -2px 0 12px rgba(0, 0, 0, 0.25);
    border-left: 1px solid #ccc;
}

.panel.collapsed {
    height: auto;
    border-left: none;
    border-bottom-left-radius: 6px;
    overflow: hidden;
}

.panel.collapsed .body,
.panel.collapsed .resize-handle,
.panel.collapsed .name {
    display: none;
}

.panel.resizing {
    user-select: none;
}

.resize-handle {
    position: absolute;
    top: 0;
    left: -3px;
    width: 6px;
    height: 100%;
    cursor: ew-resize;
    z-index: 1;
}

.resize-handle:hover,
.panel.resizing .resize-handle {
    background: rgba(41, 147, 251, 0.4);
}

header {
    display: flex;
    align-items: center;
    gap: 8px;
    padding: 6px 10px;
    background: #2b2d31;
    color: #eee;
    cursor: pointer;
    user-select: none;
    flex: none;
}

header .title {
    font-weight: 600;
    letter-spacing: 0.05em;
}

header .name {
    color: #9ab;
}

header .summary {
    margin-left: auto;
    color: #aaa;
    font-variant-numeric: tabular-nums;
}

header .toggle {
    all: unset;
    cursor: pointer;
    width: 14px;
    text-align: center;
    color: #ccc;
}

.body {
    flex: 1;
    overflow: auto;
    padding: 10px 14px;
    container-type: inline-size;
}

h2, h3 {
    margin: 0 0 6px;
    font-weight: 600;
}

h2 { font-size: 14px; }
h3 { font-size: 13px; }

p { margin: 0 0 6px; }

main {
    display: grid;
    gap: 18px;
    grid-template-columns: minmax(0, 1fr);
    grid-template-areas: "entities"
                         "components"
                         "filters"
                         "systems";
}

@container (min-width: 640px) {
    main {
        grid-template-columns: repeat(2, minmax(0, 1fr));
        grid-template-areas: "entities components"
                             "filters  systems";
    }
}

@container (min-width: 1024px) {
    main {
        grid-template-columns: repeat(3, minmax(0, 1fr));
        grid-template-rows: auto 1fr;
        grid-template-areas: "entities   filters systems"
                             "components filters systems";
    }
}

.entities   { grid-area: entities; }
.components { grid-area: components; display: grid; align-content: start; }
.filters    { grid-area: filters; }
.systems    { grid-area: systems; }

.component-graph-row {
    padding-top: 10px;
    display: grid;
    grid-template-columns: minmax(0, 1fr) minmax(0, 2fr);
}

.timeline {
    min-width: 0;
}

.component-name {
    display: flex;
    justify-content: flex-end;
    align-items: center;
    margin-right: 6px;
    overflow: hidden;
    text-overflow: ellipsis;
    white-space: nowrap;
}

.filter {
    padding: 6px 8px;
    background-color: rgba(0, 0, 0, 0.12);
    margin-bottom: 2px;
    display: flex;
    flex-direction: row;
    justify-content: space-between;
    align-items: center;
    gap: 6px;
}

.filters > .filter {
    margin-bottom: 6px;
}

.filter-components {
    display: flex;
    flex-wrap: wrap;
    align-items: center;
    gap: 4px;
}

.filter-label {
    padding-right: 2px;
}

.filter-component {
    background-color: rgba(0, 0, 0, 0.55);
    border-radius: 6px;
    padding: 2px 6px;
    color: white;
}

.donut {
    display: flex;
    margin-bottom: 10px;
}

.donut svg {
    flex: none;
}

.donut-legend {
    display: flex;
    flex-direction: column;
    align-items: flex-start;
    justify-content: center;
    padding-left: 10px;
}

.donut-legend-row {
    display: flex;
    align-items: center;
}

.swatch {
    width: 10px;
    height: 10px;
    margin-right: 5px;
}

.system {
    background-color: rgba(0, 0, 0, 0.05);
    margin-bottom: 16px;
    display: grid;
    grid-template-columns: 2fr 64px 44px 1fr;
    grid-template-areas: "systemName    systemTime    systemPercent noop"
                         "systemFilters systemFilters systemFilters systemFilters";
    font-variant-numeric: tabular-nums;
}

.system-name {
    grid-area: systemName;
    border-left: 4px solid transparent;
    padding: 8px;
    overflow: hidden;
    text-overflow: ellipsis;
}

.system-time    { grid-area: systemTime; padding: 8px 4px; }
.system-percent { grid-area: systemPercent; padding: 8px 4px; }

.system-filters {
    grid-area: systemFilters;
    padding-left: 20px;
    background-color: white;
}
`
