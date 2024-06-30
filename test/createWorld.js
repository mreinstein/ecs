import ECS from '../ecs.js'
import tap from 'tap'


const w = ECS.createWorld()

tap.same(w, {
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
