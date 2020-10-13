import ECS from '../ecs.js'
import tap from 'tap'


const w = ECS.createWorld()

const e = ECS.createEntity(w)
ECS.addComponentToEntity(w, e, 'position', { x: 4, y: 12 })

const e2 = ECS.createEntity(w)
ECS.addComponentToEntity(w, e2, 'position', { x: 10, y: 0 })
ECS.addComponentToEntity(w, e2, 'flimflam', { color: 'orange' })

// find all entities that have position but not flimflam
const entitiesNotted = ECS.getEntities(w, [ 'position', '!flimflam' ])
tap.equal(entitiesNotted.length, 1)
tap.same(entitiesNotted[0], e)
