import ECS from '../ecs.js'
import tap from 'tap'


const w = ECS.addWorld()

const e = ECS.addEntity(w)

tap.same(w.entities, [ e ])
