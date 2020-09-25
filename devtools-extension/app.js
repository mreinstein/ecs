import debounce from 'lodash.debounce'
import html     from 'https://cdn.jsdelivr.net/npm/snabby@2/snabby.js'
import timeline from 'https://cdn.jsdelivr.net/gh/mreinstein/snabbdom-timeline/timeline.js'


let currentVnode = document.querySelector('main')

const model = {
    startTime: Date.now(),
    maxSampleCount: 4000,

    mainWidth: 0,

    entityCount: {
        currentCount: 0,
        maxValue: 0,
        timeline: {
            container: undefined,
            width: 0,
            graphs: [
                {
                    title: 'Entity Count',
                    label: '',
                    type: 'linePlot',  // scatterPlot | linePlot
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
            graphs: [
                {
                    title: 'Component Count',
                    label: '',
                    type: 'linePlot',  // scatterPlot | linePlot
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


//window.MM = model

const backgroundPageConnection = chrome.runtime.connect({
    name: 'mreinstein/ecs-devtools'
})

backgroundPageConnection.postMessage({
    name: 'init',
    tabId: chrome.devtools.inspectedWindow.tabId
})


backgroundPageConnection.onMessage.addListener(function (message) {
    // worldCreated || refreshData || disabled
    if (message.method === 'worldCreated') {
        model.entityCount.currentCount = 0
        model.entityCount.maxValue = 100
        model.entityCount.timeline.graphs[0].data.length = 0

        model.componentCount.totalUniqueComponentTypes = 0
        model.componentCount.maxValue = 100
        model.componentCount.timeline.graphs[0].data.length = 0

    } else if (message.method === 'refreshData') {
        const stats = message.data
        const t = (Date.now() - model.startTime) / 1000

        model.entityCount.maxValue = Math.max(model.entityCount.maxValue, stats.entityCount)
        model.entityCount.currentCount = stats.entityCount

        model.entityCount.timeline.graphs[0].data.push({ t, value: stats.entityCount })
        model.entityCount.timeline.graphs[0].yRange.end = Math.round(model.entityCount.maxValue * 1.1)


        model.componentCount.totalUniqueComponentTypes = Object.keys(stats.componentCount).length
        let totalCount = 0
        for (const componentId in stats.componentCount) {
            totalCount += stats.componentCount[componentId]
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


function render (model, update) {

    const _insertHook = function (vnode) {
        const main = vnode.elm.parentNode

        const waitMs = 200
        const resizeHandler = debounce(function () {
            model.mainWidth = main.offsetWidth
            update()
        }, waitMs)

        const ro = new ResizeObserver(resizeHandler)
        ro.observe(main);
    }

    let resp = ''
    if (model.mainWidth > 1024)
        resp = 'col3'
    else if (model.mainWidth > 640)
        resp = 'col2'

    return html`<main class="${resp}">
        <div class="entities" key="entities" @hook:insert=${_insertHook}>
            <h2>Entities (${model.entityCount.currentCount})</h2>
            ${renderEntityGraph(model.entityCount.timeline, update)}
        </div>

        <div class="components">
            <h2>Components (${model.componentCount.totalUniqueComponentTypes})</h2>
            ${renderEntityGraph(model.componentCount.timeline, update)}
        </div>

        <div class="queries"></div>

        <div class="systems"></div>

    </main>`
}

