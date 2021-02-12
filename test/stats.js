import ECS from '../ecs.js'
import tap from 'tap'


async function sleep (ms) {
    return new Promise(function (resolve, reject) {
        setTimeout(resolve, ms)
    })
}


async function main () {
    const w = ECS.createWorld()

    tap.same(w.stats, {
        entityCount: 0,
        componentCount: { },
        filterInvocationCount: { },
        systems: [ ],
        currentSystem: 0,
        lastSendTime: 0
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
        currentSystem: 0,
        lastSendTime: 0
    }, 'adding entity and components updates counts')



    const w2 = ECS.createWorld()
    const e2 = ECS.createEntity(w2)
    ECS.addComponentToEntity(w2, e2, 'componentId1')
    ECS.addComponentToEntity(w2, e2, 'componentId1')

    tap.same(w2.stats, {
        entityCount: 1,
        componentCount: {
            componentId1: 1,
        },
        filterInvocationCount: { },
        systems: [ ],
        currentSystem: 0,
        lastSendTime: 0
    }, 'adding the same component name twice should not affect component count')




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
        currentSystem: 0,
        lastSendTime: 0
    }, 'adding system updates stats')


    ECS.fixedUpdate(w)

    tap.same(w.stats.filterInvocationCount, {
        'componentId1,componentId2': 1,
        'componentId3': 1
    }, 'running the systems updates filter counts')

    tap.same(w.stats.systems[0].filters, {
        'componentId1,componentId2': 1,
        'componentId3': 0, // this is 0 because no entities have this component, so none matched
    }, 'running the systems updates filter counts')


    ECS.cleanup(w)
    await sleep(1)

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
        currentSystem: 0,
        lastSendTime: 0
    }, 'calling cleanup resets stats for the next frame')


    ECS.removeEntity(w, e)
    ECS.cleanup(w)
    await sleep(1)

    tap.same(w.stats, {
        entityCount: 0,
        componentCount: {
            componentId1: 0,
            componentId2: 0
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
        currentSystem: 0,
        lastSendTime: 0
    }, 'removing an entity cleanups up component and entity counts')

}


main()
