import ECS from '../ecs.js'
import tap from 'tap'


const w = ECS.createWorld()

tap.same(w, {
    entities: [ ],
    filters: { },
    systems: [ ],
    listeners: {
        added: { },
        removed: { }
    },
    removals: {
        entities: [ ],
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
