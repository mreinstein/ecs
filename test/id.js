import ECS from '../ecs.js'
import tap from 'tap'


{
	const w = ECS.createWorld()

	const e1 = ECS.createEntity(w)
	const e2 = ECS.createEntity(w)
	const e3 = ECS.createEntity(w)

	tap.equal(ECS.getEntityId(w, e1), 1, 'generates an integer id')
	tap.equal(ECS.getEntityId(w, e2), 2, 'generates an integer id')
	tap.equal(ECS.getEntityId(w, e3), 3, 'generates an integer id')

	tap.equal(e1, ECS.getEntityById(w, 1), 'retrieves entity by id')
	tap.equal(e2, ECS.getEntityById(w, 2), 'retrieves entity by id')
	tap.equal(e3, ECS.getEntityById(w, 3), 'retrieves entity by id')
}


// immediate entity removal works as expected
{
	const w = ECS.createWorld()

	const e1 = ECS.createEntity(w)

	tap.equal(ECS.getEntityId(w, e1), 1, 'generates an integer id')
	tap.equal(e1, ECS.getEntityById(w, 1), 'retrieves entity by id')

	// removing an entity removes it's id

	const deferredRemoval = false
	ECS.removeEntity(w, e1, deferredRemoval)

	tap.equal(ECS.getEntityId(w, e1), undefined, 'entity id is removed')
	tap.equal(undefined, ECS.getEntityById(w, 1), 'entity is removed')
}


// deferred entity removal works as expected
{
	const w = ECS.createWorld()

	const e1 = ECS.createEntity(w)

	tap.equal(ECS.getEntityId(w, e1), 1, 'generates an integer id')
	tap.equal(e1, ECS.getEntityById(w, 1), 'retrieves entity by id')

	// removing an entity removes it's id

	const deferredRemoval = true
	ECS.removeEntity(w, e1, deferredRemoval)

	// entity is still present because we haven't cleaned up yet
	tap.equal(ECS.getEntityId(w, e1), 1, 'entity id is removed')
	tap.equal(e1, ECS.getEntityById(w, 1), 'retrieves entity by id')

	ECS.cleanup(w)

	// now they should be gone
	tap.equal(ECS.getEntityId(w, e1), undefined, 'entity id is removed')
	tap.equal(undefined, ECS.getEntityById(w, 1), 'entity is removed')
}


{
	const w = ECS.createWorld()

	const e1 = ECS.createEntity(w)
	const e2 = ECS.createEntity(w)
	const e3 = ECS.createEntity(w)

	const deferredRemoval = true

	ECS.removeEntity(w, e1, deferredRemoval)
	ECS.removeEntity(w, e2, deferredRemoval)
	ECS.removeEntity(w, e3, deferredRemoval)

	ECS.cleanup(w)
	
	const e4 = ECS.createEntity(w)
	tap.equal(ECS.getEntityId(w, e4), 4, 'entity id still increments despite entity removal')
}



