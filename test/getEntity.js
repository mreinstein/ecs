import ECS from '../ecs.js'
import tap from 'tap'


{
	const w = ECS.addWorld()

	const h = ECS.getEntity(w, [ 'hero' ])

	tap.equal(h, undefined, 'no match returns undefined')
}


{
	const w = ECS.addWorld()

	const e = ECS.addEntity(w)
	ECS.addComponent(w, e, 'hero')

	const h = ECS.getEntity(w, [ 'hero' ])

	tap.equal(h, e, 'finds 1 matching entity')
}


{
	const w = ECS.addWorld()

	const e = ECS.addEntity(w)
	ECS.addComponent(w, e, 'hero')
	ECS.addComponent(w, e, 'a')

	const e2 = ECS.addEntity(w)
	ECS.addComponent(w, e2, 'hero')
	ECS.addComponent(w, e2, 'b')

	const h = ECS.getEntity(w, [ 'hero' ])

	tap.equal(h, e, 'returns the first match even if there are more than one')
}
