import ECS from '../ecs.js'
import tap from 'tap'

// removing component named 'A' should not break filter for component 'AB'

const w = ECS.createWorld()
const e = ECS.createEntity(w)

ECS.addComponentToEntity(w, e, 'A')
ECS.addComponentToEntity(w, e, 'AB')
tap.equal(ECS.getEntities(w, [ 'AB' ]).length, 1)

ECS.removeComponentFromEntity(w, e, 'A',false)

tap.equal(ECS.getEntities(w, [ 'AB' ]).length, 1)
