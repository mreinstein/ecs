import ECS from '../ecs.js'
import tap from 'tap'


const w = ECS.createWorld()

const e = ECS.createEntity(w)

ECS.addComponentToEntity(w, e, 'a')
tap.same(ECS.getEntities(w, [ 'a', '!b' ], 'removed'), [ ])

ECS.removeEntity(w, e)
ECS.cleanup(w)
tap.same(ECS.getEntities(w, [ 'a', '!b' ], 'removed'), [ e ], 'removing entity should add it to removed listeners')
