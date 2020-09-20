import ECS from '../ecs.js'
import tap from 'tap'


const w = ECS.createWorld()

tap.same(w.stats, {
    entityCount: 0,
    componentCount: { },
    filterInvocationCount: { },
    systems: [ ],
    currentSystem: 0
}, 'initial stats data')


const e = ECS.createEntity(w)
ECS.addComponentToEntity(w, e, 'componentId1')
ECS.addComponentToEntity(w, e, 'componentId2')

tap.same(w.stats, {
    entityCount: 1,
    componentCount: {
        componentId1: 1,
        componentId2: 1
    },
    filterInvocationCount: { },
    systems: [ ],
    currentSystem: 0
}, 'adding entity and components updates counts')


function testSystem () {
    return {
        onFixedUpdate: function () {
            const results = ECS.getEntities(w, [ 'componentId1', 'componentId2' ])

            const results2 = ECS.getEntities(w, [ 'componentId3' ])
        }
    }
}

ECS.addSystem(w, testSystem)

tap.same(w.stats, {
    entityCount: 1,
    componentCount: {
        componentId1: 1,
        componentId2: 1
    },
    filterInvocationCount: { },
    systems: [
        {
            name: 'testSystem',
            timeElapsed: 0,
            filters: { }
        }
    ],
    currentSystem: 0
}, 'adding system updates stats')


ECS.fixedUpdate(w)

tap.same(w.stats, {
    entityCount: 1,
    componentCount: {
        componentId1: 1,
        componentId2: 1
    },
    filterInvocationCount: {
        'componentId1,componentId2': 1,
        'componentId3': 1
    },
    systems: [
        {
            name: 'testSystem',
            timeElapsed: 0,
            filters: {
                'componentId1,componentId2': 1,
                'componentId3': 0, // this is 0 because no entities have this component, so none matched
            }
        }
    ],
    currentSystem: 0
}, 'running the systems updates filter counts')


ECS.cleanup(w)

setTimeout(function () {
    tap.same(w.stats, {
        entityCount: 1,
        componentCount: {
            componentId1: 1,
            componentId2: 1
        },
        filterInvocationCount: {
            'componentId1,componentId2': 0,
            'componentId3': 0
        },
        systems: [
        {
            name: 'testSystem',
            timeElapsed: 0,
            filters: {
                'componentId1,componentId2': 0,
                'componentId3': 0,
            }
        }
    ],
        currentSystem: 0
    }, 'calling cleanup resets stats for the next frame')
}, 1)


