import ECS from '../ecs.js'
import tap from 'tap'


const w = ECS.createWorld()

const e = ECS.createEntity(w)

ECS.addComponentToEntity(w, e, 'position', { x: 4, y: 12 })

tap.same(w.entities, [ { position: { x: 4, y: 12 } } ])




const w3 = ECS.createWorld()

const entities6 = ECS.getEntities(w3, [ 'dupe' ], 'added')

const e8 = ECS.createEntity(w3)

ECS.addComponentToEntity(w3, e8, 'dupe')
ECS.addComponentToEntity(w3, e8, 'dupe')
ECS.addComponentToEntity(w3, e8, 'dupe')
ECS.addComponentToEntity(w3, e8, 'dupe')

tap.same(ECS.getEntities(w3, [ 'dupe' ], 'added'), [ e8 ], 'multiple additions only appear once in the added list')
