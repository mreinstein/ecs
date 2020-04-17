import ECS from '../ecs.js'
import tap from 'tap'


const w = ECS.createWorld()

const e = ECS.createEntity(w)

tap.equal(w.entities.length, 1)

const someNonEntity = { }
ECS.removeEntity(w, someNonEntity)

tap.equal(w.entities.length, 1, 'removing some other random object doesnt have any effect')

ECS.removeEntity(w, e)
tap.equal(w.entities.length, 0, 'entity gets removed from the world')



const e2 = ECS.createEntity(w)

ECS.getEntities(w, [ 'a' ])  // filter 1
ECS.getEntities(w, [ 'a', 'b' ])

ECS.addComponentToEntity(w, e2, 'a', { a: 23 })
ECS.addComponentToEntity(w, e2, 'b', { b: 64 })

tap.equal(w.filters['a'].length, 1)
tap.equal(w.filters['a,b'].length, 1)

ECS.removeEntity(w, e2)

tap.equal(w.filters['a'].length, 0, 'removing entities removes them from all matching filters')
tap.equal(w.filters['a,b'].length, 0, 'removing entities removes them from all matching filters')
