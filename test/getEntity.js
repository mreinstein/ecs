import ECS from '../ecs.js'
import tap from 'tap'


{
	const w = ECS.createWorld()

	const h = ECS.getEntity(w, [ 'hero' ])

	tap.equal(h, undefined, 'no match returns undefined')
}


{
	const w = ECS.createWorld()

	const e = ECS.createEntity(w)
	ECS.addComponentToEntity(w, e, 'hero')

	const h = ECS.getEntity(w, [ 'hero' ])

	tap.equal(h, e, 'finds 1 matching entity')
}


{
	const w = ECS.createWorld()

	const e = ECS.createEntity(w)
	ECS.addComponentToEntity(w, e, 'hero')
	ECS.addComponentToEntity(w, e, 'a')

	const e2 = ECS.createEntity(w)
	ECS.addComponentToEntity(w, e2, 'hero')
	ECS.addComponentToEntity(w, e2, 'b')

	const h = ECS.getEntity(w, [ 'hero' ])

	tap.equal(h, e, 'returns the first match even if there are more than one')
}
