import debounce from 'https://cdn.skypack.dev/lodash.debounce'
import html     from 'https://cdn.skypack.dev/snabby'
import timeline from 'https://cdn.skypack.dev/snabbdom-timeline'


// inspired by ecsy https://blog.mozvr.com/ecsy-developer-tools/

/*
<svg viewBox="0 0 100 100" width="100%" height="100%" style="display: block;">
    <path d="M 96.25 50 A 46.25 46.25 0 0 1 90.88702513282273 71.61743915888101" stroke-width="7.5" stroke="hsl(54, 100%, 57%)" fill="none">
        <title>MovableSystem</title>
    </path>
    <path d="M 87.48054937231139 77.09743380377057 A 46.25 46.25 0 1 1 95.79989817929763 43.563244080596995" stroke-width="7.5" stroke="hsl(34, 100%, 57%)" fill="none">
        <title>RendererSystem</title>
    </path>
</svg>
*/


let currentVnode = document.querySelector('main')

const model = {
    startTime: Date.now(),
    maxSampleCount: 100,

    entityCount: {
        instanceCount: 0,
        maxValue: 0,
        timeline: {
            container: undefined,
            width: 0,
            renderer: 'canvas',
            graphs: [
                {
                    title: 'Entity Count',
                    label: '',
                    type: 'linePlot',  // scatterPlot | linePlot
                    linePlotAreaColor: 'rgba(41, 147, 251, 0.3)', // color to fill area if in linePlot mode
                    timeRange: {
                        start: 0,  // seconds
                        end: 0     // seconds
                    },
                    yRange: {
                        start: 0,
                        end: 100
                    },

                    // optional: render a selection control
                    selection: {
                        type: 'none',
                        start: 0,       // seconds | 0
                        end: Infinity,  // seconds | Infinity
                        dragging: false
                    },

                    height: 40,              // pixels
                    dataColor: 'dodgerblue', // color of data points on the graph
                    renderTicks: false,
                    renderValueLabel: false,

                    // the data points to render
                    data: [ ],

                    // optional: settings for grid background lines
                    gridLines: { }
                }
            ]
        }
    },

    componentCount: {
        totalUniqueComponentTypes: 0,
        maxValue: 0,
        timeline: {
            container: undefined,
            width: 0,
            renderer: 'canvas',
            graphs: [
                {
                    title: 'Components Count',
                    label: '',
                    type: 'linePlot',  // scatterPlot | linePlot
                    linePlotAreaColor: 'rgba(41, 147, 251, 0.3)', // color to fill area if in linePlot mode
                    timeRange: {
                        start: 0,  // seconds
                        end: 0     // seconds
                    },
                    yRange: {
                        start: 0,
                        end: 100
                    },

                    // optional: render a selection control
                    selection: {
                        type: 'none',
                        start: 0,       // seconds | 0
                        end: Infinity,  // seconds | Infinity
                        dragging: false
                    },

                    height: 40,              // pixels
                    dataColor: 'dodgerblue', // color of data points on the graph
                    renderTicks: false,
                    renderValueLabel: false,

                    // the data points to render
                    data: [ ],

                    // optional: settings for grid background lines
                    gridLines: { }
                }
            ]
        }
    },

    components: { }, // key is component id/name, value is the timeline for each component

    /*
    example system:
        {
            filters: {
                hero,rigidBody,facing: 1
                transform,pointLight: 21
            },
            name: "lightSystem",
            timeElapsed: 0.025000001187436283
        }
    */
    systems: [ ]
}


const backgroundPageConnection = chrome.runtime.connect({
    name: 'mreinstein/ecs-devtools'
})

backgroundPageConnection.postMessage({
    name: 'init',
    tabId: chrome.devtools.inspectedWindow.tabId
})


function createComponentTimeline (componentId) {
    return {
        instanceCount: 0,
        maxValue: 0,
        timeline: {
            container: undefined,
            width: 0,
            renderer: 'canvas',
            graphs: [
                {
                    title: 'Component Count',
                    label: '',
                    type: 'linePlot',  // scatterPlot | linePlot
                    linePlotAreaColor: 'rgba(41, 147, 251, 0.3)', // color to fill area if in linePlot mode
                    timeRange: {
                        start: 0,  // seconds
                        end: 0     // seconds
                    },
                    yRange: {
                        start: 0,
                        end: 100
                    },

                    // optional: render a selection control
                    selection: {
                        type: 'none',
                        start: 0,       // seconds | 0
                        end: Infinity,  // seconds | Infinity
                        dragging: false
                    },

                    height: 40,              // pixels
                    dataColor: 'dodgerblue', // color of data points on the graph
                    renderTicks: false,
                    renderValueLabel: false,

                    // the data points to render
                    data: [ ],

                    // optional: settings for grid background lines
                    gridLines: { }
                }
            ]
        }
    }
}


backgroundPageConnection.onMessage.addListener(function (message) {
    // worldCreated || refreshData || disabled
    if (message.method === 'worldCreated' || message.method === 'tab-complete') {
        // reset the model

        model.entityCount.instanceCount = 0
        model.entityCount.maxValue = 100
        model.entityCount.timeline.graphs[0].data.length = 0

        model.componentCount.totalUniqueComponentTypes = 0
        model.componentCount.maxValue = 100
        model.componentCount.timeline.graphs[0].data.length = 0
        model.componentCount.timeline.graphs[0].label = ''

        model.components = { }
        model.systems.length = 0

    } else if (message.method === 'refreshData') {
        const stats = message.data
        const t = (Date.now() - model.startTime) / 1000

        model.entityCount.maxValue = Math.max(model.entityCount.maxValue, stats.entityCount)
        model.entityCount.instanceCount = stats.entityCount

        model.entityCount.timeline.graphs[0].data.push({ t, value: stats.entityCount })
        model.entityCount.timeline.graphs[0].yRange.end = Math.round(model.entityCount.maxValue * 1.1)


        model.componentCount.totalUniqueComponentTypes = Object.keys(stats.componentCount).length
        let totalCount = 0
        for (const componentId in stats.componentCount) {
            const componentCount = stats.componentCount[componentId]

            totalCount += componentCount

            if (!model.components[componentId])
                model.components[componentId] = createComponentTimeline(componentId)

            const ct = model.components[componentId]

            ct.maxValue = Math.max(ct.maxValue, componentCount + 10)
            ct.instanceCount = componentCount
            ct.timeline.graphs[0].data.push({ t, value: componentCount })
            ct.timeline.graphs[0].yRange.end = Math.round(ct.maxValue * 1.1)

            ct.timeline.graphs[0].label = componentCount

            // limit the n sd..fumber of samples in the graph
            if (ct.timeline.graphs[0].data.length > model.maxSampleCount) {
                ct.timeline.graphs[0].data.shift()
                ct.timeline.graphs[0].timeRange.start = ct.timeline.graphs[0].data[0].t
            }

            ct.timeline.graphs[0].timeRange.end = t
        }

        model.componentCount.timeline.graphs[0].data.push({ t, value: totalCount })
        model.componentCount.timeline.graphs[0].label = totalCount
        model.componentCount.maxValue = Math.max(model.componentCount.maxValue, totalCount)
        model.componentCount.timeline.graphs[0].yRange.end = Math.round(model.componentCount.maxValue * 1.1)


        // limit the number of samples in the graph
        if (model.entityCount.timeline.graphs[0].data.length > model.maxSampleCount) {
            model.entityCount.timeline.graphs[0].data.shift()
            model.entityCount.timeline.graphs[0].timeRange.start = model.entityCount.timeline.graphs[0].data[0].t
            // TODO: re-calculate entity graph max value

            model.componentCount.timeline.graphs[0].data.shift()
            model.componentCount.timeline.graphs[0].timeRange.start = model.componentCount.timeline.graphs[0].data[0].t
            // TODO: re-calculate component graph max value
        }

        model.entityCount.timeline.graphs[0].timeRange.end = t
        model.componentCount.timeline.graphs[0].timeRange.end = t

        model.systems = message.data.systems
    }

    update()
})


function update () {
    const newVnode = render(model, update)
    currentVnode = html.update(currentVnode, newVnode)
}


function renderEntityGraph (timelineModel, update) {
    const c = timeline(timelineModel, update)
    timelineModel.container = c
    return c
}


function renderComponentGraphs(components, update) {
    return Object.keys(components).map((componentId) => {
        const c = components[componentId]
        return html`<div class="component-graph-row">
        <div style="display: flex; justify-content: flex-end; align-items: center; margin-right: 6px;">${componentId}</div>${renderEntityGraph(c.timeline, update)}
        </div>`
    })
}


function filtersView (systems, update) {

    // get all unique filters
    const filters = { }

    for (const s of systems)
        for (const f of Object.keys(s.filters))
            filters[f] = s.filters[f]

    const filterViews = Object.keys(filters)
        .filter((f) => filters[f] > 0)
        .map((f) => {
            const components = f.split(',').map((c) => html`<div class="system-filter-component">${c}</div>`)
            const entityCount = filters[f]
            return html`<div class="system-filter" style="padding: 4px; margin-bottom: 6px;">
                <div style="padding-right: 4px; display: flex; align-items: center;">
                    ${components}
                </div>
                <div>${entityCount}</div>
            </div>`
        })

    return html`<div class="filters">
        <h3>Filters (${Object.keys(filters).length})</h3>
        ${filterViews}
    </div>`
}


function systemsOverviewGraphView (systems, update) {

    const segments = [ ]

    let totalTime = 0
    for (const s of systems)
        totalTime += s.timeElapsed

    const significant = [ ]

    if (systems.length) {
        const colorDivisor = 360 / systems.length

        // Total of all preceding segments length
        // For use in stroke-dashoffset calculation
        let totalPercent = 0

        for (let i = 0; i < systems.length; i++) {
            const system = systems[i]
            // percentage occupied by current segment
            const percent = Math.floor(system.timeElapsed / totalTime * 100)

            if (percent === 0)
                continue
            
            // current segments stroke-dasharray calculation
            const strokeDasharray = `${percent} ${100 - percent}`

            const color = Math.round(i * colorDivisor)
            const strokeColor = `hsl(${color}, 100%, 50%)`

            if (percent > 3)
                significant.push({ name: system.name, percent, strokeColor })

            const strokeDashOffset = -totalPercent

            segments.push(html`<circle class="donut-segment" cx="21" cy="21" r="15.91549430918954" fill="transparent" stroke="${strokeColor}" stroke-width="3" stroke-dasharray="${strokeDasharray}" stroke-dashoffset="${strokeDashOffset}" title="${system.name}"/>`)
            
            totalPercent += percent
        }
    }

    return html`<div style="display:flex; grid-template-columns: 1fr 110px">
        <svg width="110px" height="110px" viewBox="0 0 42 42" xmlns="http://www.w3.org/2000/svg">
            <circle class="donut-hole" cx="21" cy="21" r="15.91549430918954" fill="#fff"/>
            <circle class="donut-ring" cx="21" cy="21" r="15.91549430918954" fill="transparent" stroke="#e2e3e4" stroke-width="3"/>
            ${segments}
        </svg>
        <div style="display: flex; flex-direction: column; align-items: flex-start; justify-content: center; padding-left: 10px;">
            ${significant.map((s) => {
                return html`<div style="display: flex;flex-direction: row; align-items: center;">
                    <div style="background-color: ${s.strokeColor}; width: 10px; height: 10px; margin-right: 5px;"></div>
                    <div> ${s.percent}%  ${s.name}</div>
                </div>`
            })}
        </div>
    </div>`
}


function systemsView (systems, update) {
    /*
    example system:
        {
            filters: {
                hero,rigidBody,facing: 1
                transform,pointLight: 21
            },
            name: "lightSystem",
            timeElapsed: 0.025000001187436283
        }
    */

    let totalTime = 0
    for (const s of systems)
        totalTime += s.timeElapsed

    const systemViews = systems.map((s, i) => {
        const percent = Math.round(s.timeElapsed / totalTime * 100)

        const filterViews = Object.keys(s.filters).map((f) => {
            const components = f.split(',').map((c) => html`<div class="system-filter-component">${c}</div>`)
            const entityCount = s.filters[f]
            return html`<div class="system-filter">
                <div style="padding-right: 4px; display: flex; align-items: center;">
                    <div style="padding-right: 6px;">FILTER:</div>
                    ${components}
                </div>
                <div>${entityCount}</div>
            </div>`
        })

        const colorDivisor = 360 / systems.length
        const color = Math.round(i * colorDivisor)
        const strokeColor = `hsl(${color}, 100%, 50%)`

        return html`<div class="system">
            <div style="grid-area: systemName; border-left: 4px solid ${strokeColor}; padding: 8px;">${s.name}</div>
            <div style="grid-area: systemTime; padding: 8px;">${s.timeElapsed.toFixed(2)}ms</div>
            <div style="grid-area: systemPercent; padding: 8px;">${percent}%</div>
            <div style="grid-area: systemQueries; padding-left: 20px; background-color: white;">
                ${filterViews}
            </div>
        </div>`
    })

    return html`<div class="systems">
        <h3>Systems (${systems.length})</h3>
        <p>Total Time: ${totalTime.toFixed(2)}ms</p>
        ${systemsOverviewGraphView(systems, update)}
        <div></div>
        ${systemViews}
    </div>`
}


function render (model, update) {

    return html`<main data-breakpoints='{ "col2": 640, "col3": 1024 }'>
        <div class="entities" key="entities">
            <h2>Entities (${model.entityCount.instanceCount})</h2>
            ${renderEntityGraph(model.entityCount.timeline, update)}
        </div>

        <div class="components">
            <h2>Components (${model.componentCount.totalUniqueComponentTypes})</h2>
            ${renderEntityGraph(model.componentCount.timeline, update)}
            ${renderComponentGraphs(model.components, update)}
        </div>

        ${filtersView(model.systems, update)}

        ${systemsView(model.systems, update)}
    </main>`
}

