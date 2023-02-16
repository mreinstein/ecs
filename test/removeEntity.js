import ECS from '../ecs.js'
import tap from 'tap'


{
	const w = ECS.createWorld()

	const e = ECS.createEntity(w)

	tap.equal(w.entities.length, 1)

	const someNonEntity = { }
	ECS.removeEntity(w, someNonEntity)

	tap.equal(w.entities.length, 1, 'removing some other random object doesnt have any effect')

	ECS.removeEntity(w, e)


	tap.same(w.deferredRemovals.entities, [ 0 ], 'entity is added to deferred entity remove list')

	ECS.cleanup(w) // process deferred removals
	tap.equal(w.entities.length, 0, 'entity gets removed from the world')
}


{
	const w = ECS.createWorld()

	const e = ECS.createEntity(w)

	ECS.getEntities(w, [ 'a' ])  // filter 1
	ECS.getEntities(w, [ 'a', 'b' ])

	ECS.addComponentToEntity(w, e, 'a', { a: 23 })
	ECS.addComponentToEntity(w, e, 'b', { b: 64 })

	tap.equal(w.filters['a'].length, 1)
	tap.equal(w.filters['a,b'].length, 1)

	ECS.removeEntity(w, e)
	ECS.cleanup(w) // process deferred removals

	tap.equal(w.filters['a'].length, 0, 'removing entities removes them from all matching filters')
	tap.equal(w.filters['a,b'].length, 0, 'removing entities removes them from all matching filters')
}


// while iterating over entities, removing an unvisited entity still gets processed
// because the removal is defferred until the cleanup step
{
	const w2 = ECS.createWorld()

	const e3 = ECS.createEntity(w2)
	ECS.addComponentToEntity(w2, e3, 'position', 'e3')

	const e4 = ECS.createEntity(w2)
	ECS.addComponentToEntity(w2, e4, 'position', 'e4')

	const e5 = ECS.createEntity(w2)
	ECS.addComponentToEntity(w2, e5, 'position', 'e5')

	let i = 0
	const processed = { }

	for (const entity of ECS.getEntities(w2, [ 'position' ])) {
		processed[entity.position] = true

		// while processing the first entity in the list, remove the 2nd entity
		if (i == 0)
			ECS.removeEntity(w2, e4)

		i++
	}

	tap.same(processed, { e3: true, e4: true, e5: true }, 'all entities processed because of deferred removal')


	const w3 = ECS.createWorld()

	const e6 = ECS.createEntity(w3)
	ECS.addComponentToEntity(w3, e6, 'position')

	ECS.getEntities(w3, [ 'position' ], 'removed')

	ECS.removeEntity(w3, e6)
	ECS.removeEntity(w3, e6)
	ECS.removeEntity(w3, e6)

	tap.same(w3.deferredRemovals.entities, [ 0 ])

	ECS.cleanup(w3)

	const result = {
		count: 0,
		entries: new Array(1000)
	}

	ECS.getEntities(w3, [ 'position' ], 'removed', result)

	tap.same(result.count, 1, 'multiple removals only appear once in the removed list')
	tap.same(result.entries[0], e6, 'multiple removals only appear once in the removed list')
}


{
	// deferred removal should immediately remove the entity
	const w = ECS.createWorld()

	const e = ECS.createEntity(w)
	ECS.addComponentToEntity(w, e, 'testc')

	tap.equal(ECS.getEntities(w, [ 'testc' ]).length, 1, '1 entity should be present')

	const deferredRemoval = false
	ECS.removeEntity(w, e, deferredRemoval)

	tap.equal(ECS.getEntities(w, [ 'testc' ]).length, 0, 'no entities present because of immediate removal')
}


{
	// removing an entity immediately doesn't screw up removing other entities via deferred removal
	const w = ECS.createWorld()

	const e = ECS.createEntity(w)
	ECS.addComponentToEntity(w, e, 'e1')

	const e2 = ECS.createEntity(w)
	ECS.addComponentToEntity(w, e2, 'e2')

	const e3 = ECS.createEntity(w)
	ECS.addComponentToEntity(w, e3, 'e3')

	ECS.cleanup(w)

	ECS.removeEntity(w, e3)

	const deferredRemoval = false
	ECS.removeEntity(w, e2, deferredRemoval)

	ECS.cleanup(w)
	
	tap.same(w.entities, [ e ], 'none deferred entity removal does not interfere with regular deferred entity removal')
}