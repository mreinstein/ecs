import ECS from '../ecs.js'
import tap from 'tap'


const w = ECS.createWorld()

const e = ECS.createEntity(w)

ECS.addComponentToEntity(w, e, 'position', { x: 4, y: 12 })
ECS.addComponentToEntity(w, e, 'health', { health: 34 })

const e2 = ECS.createEntity(w)
ECS.addComponentToEntity(w, e2, 'health', { health: 34 })


const entities = ECS.getEntities(w, [ 'position' ])
const entities2 = ECS.getEntities(w, [ 'position', 'health' ])

tap.equal(entities.length, 1)
tap.equal(entities2.length, 1)

ECS.removeComponentFromEntity(w, e, 'position')

const entities3 = ECS.getEntities(w, [ 'position' ])
const entities4 = ECS.getEntities(w, [ 'position', 'health' ])
const entities5 = ECS.getEntities(w, [ 'health' ])

tap.equal(entities3.length, 0)
tap.equal(entities4.length, 0)
tap.equal(entities5.length, 2)
