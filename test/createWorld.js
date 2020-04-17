import ECS from '../ecs.js'
import tap from 'tap'


const w = ECS.createWorld()

tap.same(w, { entities: [ ], filters: { }, systems: [ ] })
