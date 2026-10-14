import ECS from '../ecs.js'
import { test } from 'node:test'
import assert from 'node:assert/strict'


test('addWorld creates empty world', function () {
    const w = ECS.addWorld()

    assert.deepEqual(w, {
        entityIds: new Map(),
        nextId: 1,
        entities: [ ],
        filters: { },
        systems: [ ],
        listeners: {
            added: new Set(),
            removed: new Set(),
            _added: new Set(),
            _removed: new Set()
        },
        deferredRemovals: {
            entities: new Set(),
            components: [ ]
        },
        stats: {
            entityCount: 0,
            componentCount: { },
            filterInvocationCount: { },
            systems: [ ],
            currentSystem: 0,
            lastSendTime: 0
        }
    })
})
