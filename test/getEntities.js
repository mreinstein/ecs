import ECS from '../ecs.js'
import tap from 'tap'


const w = ECS.createWorld()

const entities = ECS.getEntities(w, [ 'position' ])

tap.equal(w.filters.position.length, 0, 'querying a filter creates it the first time')



const e = ECS.createEntity(w)

ECS.addComponentToEntity(w, e, 'position', { x: 4, y: 12 })

tap.same(w.filters.position, [ { position: { x: 4, y: 12 } } ], 'new entities are added to existing filters')



ECS.getEntities(w, [ 'health' ])

tap.equal(w.filters.health.length, 0, 'new filter starts out empty')

const e2 = ECS.createEntity(w)
ECS.addComponentToEntity(w, e2, 'health', { max: 10, current: 8 })

tap.same(w.filters.health, [ e2 ], 'when adding components to entities makes them match existing filters, add them')



const e3 = ECS.createEntity(w)
ECS.addComponentToEntity(w, e3, 'a', { val: 10 })
ECS.addComponentToEntity(w, e3, 'b', { val: 20 })

tap.equal(1, ECS.getEntities(w, [ 'a', 'b' ]).length, 'order of components in filter does not matter')
tap.equal(1, ECS.getEntities(w, [ 'b', 'a' ]).length, 'order of components in fitler does not matter')
