import ECS from '../ecs.js'
import { test } from 'node:test'
import assert from 'node:assert/strict'


test('stats', function () {
    const w = ECS.addWorld()

    assert.deepEqual(w.stats, {
        entityCount: 0,
        componentCount: { },
        filterInvocationCount: { },
        _filterInvocationCount: { },
        systems: [ ],
        currentSystem: 0
    }, 'initial stats data')


    const e = ECS.addEntity(w)
    ECS.addComponent(w, e, 'componentId1')
    ECS.addComponent(w, e, 'componentId2')

    assert.deepEqual(w.stats, {
        entityCount: 1,
        componentCount: {
            componentId1: 1,
            componentId2: 1
        },
        filterInvocationCount: { },
        _filterInvocationCount: { },
        systems: [ ],
        currentSystem: 0
    }, 'adding entity and components updates counts')



    const w2 = ECS.addWorld()
    const e2 = ECS.addEntity(w2)
    ECS.addComponent(w2, e2, 'componentId1')
    ECS.addComponent(w2, e2, 'componentId1')

    assert.deepEqual(w2.stats, {
        entityCount: 1,
        componentCount: {
            componentId1: 1,
        },
        filterInvocationCount: { },
        _filterInvocationCount: { },
        systems: [ ],
        currentSystem: 0
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

    assert.deepEqual(w.stats, {
        entityCount: 1,
        componentCount: {
            componentId1: 1,
            componentId2: 1
        },
        filterInvocationCount: { },
        _filterInvocationCount: { },
        systems: [
            {
                name: 'testSystem',
                timeElapsed: 0,
                filters: { },
                _timeElapsed: 0,
                _filters: { }
            }
        ],
        currentSystem: 0
    }, 'adding system updates stats')


    ECS.fixedUpdate(w)

    assert.deepEqual(w.stats._filterInvocationCount, {
        'componentId1,componentId2': 1,
        'componentId3': 1
    }, 'running the systems accumulates filter counts for the in-progress frame')

    assert.deepEqual(w.stats.systems[0]._filters, {
        'componentId1,componentId2': 1,
        'componentId3': 0, // this is 0 because no entities have this component, so none matched
    }, 'running the systems accumulates filter matches for the in-progress frame')

    assert.deepEqual(w.stats.filterInvocationCount, { }, 'in-progress frame is not published yet')
    assert.deepEqual(w.stats.systems[0].filters, { }, 'in-progress frame is not published yet')


    ECS.cleanup(w)

    assert.equal(w.stats.systems[0]._timeElapsed, 0)
    assert.ok(w.stats.systems[0].timeElapsed >= 0)

    assert.deepEqual(w.stats, {
        entityCount: 1,
        componentCount: {
            componentId1: 1,
            componentId2: 1
        },
        filterInvocationCount: {
            'componentId1,componentId2': 1,
            'componentId3': 1
        },
        _filterInvocationCount: {
            'componentId1,componentId2': 0,
            'componentId3': 0
        },
        systems: [
            {
                name: 'testSystem',
                timeElapsed: w.stats.systems[0].timeElapsed,
                filters: {
                    'componentId1,componentId2': 1,
                    'componentId3': 0,
                },
                _timeElapsed: 0,
                _filters: {
                    'componentId1,componentId2': 0,
                    'componentId3': 0,
                }
            }
        ],
        currentSystem: 0
    }, 'calling cleanup publishes the frame stats and resets the accumulators')


    ECS.removeEntity(w, e)
    ECS.cleanup(w)

    assert.deepEqual(w.stats, {
        entityCount: 0,
        componentCount: {
            componentId1: 0,
            componentId2: 0
        },
        filterInvocationCount: {
            'componentId1,componentId2': 0,
            'componentId3': 0
        },
        _filterInvocationCount: {
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
                },
                _timeElapsed: 0,
                _filters: {
                    'componentId1,componentId2': 0,
                    'componentId3': 0,
                }
            }
        ],
        currentSystem: 0
    }, 'a frame where no systems ran publishes zeros, and entity removal updates counts')
})


test('stats describe the last completed frame and stay readable until the next cleanup', async function () {
    const w = ECS.addWorld()

    let burnMs = 2

    function slowSystem (world) {
        return {
            onUpdate () {
                ECS.getEntities(world, [ 'a' ])
                const start = performance.now()
                while (performance.now() - start < burnMs) { }
            }
        }
    }

    ECS.addSystem(w, slowSystem)
    ECS.addComponent(w, ECS.addEntity(w), 'a')

    ECS.update(w, 16)
    ECS.update(w, 16)  // multiple updates in one frame accumulate
    ECS.cleanup(w)

    const frame1 = w.stats.systems[0].timeElapsed
    assert.ok(frame1 >= 4, 'time from both updates is published')
    assert.deepEqual(w.stats.systems[0].filters, { a: 2 })
    assert.deepEqual(w.stats.filterInvocationCount, { a: 2 })

    // nothing resets the published stats asynchronously
    await new Promise((resolve) => setTimeout(resolve, 5))
    assert.equal(w.stats.systems[0].timeElapsed, frame1)
    assert.deepEqual(w.stats.systems[0].filters, { a: 2 })

    // the next frame replaces them
    burnMs = 0
    ECS.update(w, 16)
    assert.equal(w.stats.systems[0].timeElapsed, frame1, 'in-progress frame does not touch published stats')
    ECS.cleanup(w)
    assert.ok(w.stats.systems[0].timeElapsed < frame1)
    assert.deepEqual(w.stats.systems[0].filters, { a: 1 })
    assert.deepEqual(w.stats.filterInvocationCount, { a: 1 })
})
