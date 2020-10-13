import ECS from '../ecs.js'
import tap from 'tap'


const w = ECS.createWorld()

const e = ECS.createEntity(w)

ECS.addComponentToEntity(w, e, 'a')

const r = ECS.getEntities(w, [ 'a', '!b' ], 'removed')
tap.same(r, [ ])

ECS.removeEntity(w, e)
const r2 = ECS.getEntities(w, [ 'a', '!b' ], 'removed')
tap.same(r2, [ e ], 'removing entity should add it to removed listeners')
