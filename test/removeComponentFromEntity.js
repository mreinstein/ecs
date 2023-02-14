import ECS from '../ecs.js'
import tap from 'tap'


{
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
	ECS.cleanup(w)

	const entities3 = ECS.getEntities(w, [ 'position' ])
	const entities4 = ECS.getEntities(w, [ 'position', 'health' ])
	const entities5 = ECS.getEntities(w, [ 'health' ])

	tap.equal(entities3.length, 0)
	tap.equal(entities4.length, 0)
	tap.equal(entities5.length, 2)
}


{
	// while iterating over entities, removing a component from an unvisited entity still gets processed
	// because the removal is defferred until the cleanup step

	const w = ECS.createWorld()

	const e = ECS.createEntity(w)
	ECS.addComponentToEntity(w, e, 'position', 'p3')

	const e2 = ECS.createEntity(w)
	ECS.addComponentToEntity(w, e2, 'position', 'p4')

	const e3 = ECS.createEntity(w)
	ECS.addComponentToEntity(w, e3, 'position', 'p5')

	let i = 0
	const processed = { }

	for (const entity of ECS.getEntities(w, [ 'position'])) {
		processed[entity.position] = true
		
		// while processing the first entity in the list, remove the 2nd entity
		if (i == 0)
			ECS.removeComponentFromEntity(w, e2, 'position')

		i++
	}

	tap.same(processed, { p3: true, p4: true, p5: true }, 'all entities processed because of deferred component removal')
}


{
	const w = ECS.createWorld()

	const e8 = ECS.createEntity(w)

	ECS.addComponentToEntity(w, e8, 'dupe', { abc: true })

	ECS.cleanup(w)

	ECS.removeComponentFromEntity(w, e8, 'dupe')
	ECS.removeComponentFromEntity(w, e8, 'dupe')
	ECS.removeComponentFromEntity(w, e8, 'dupe')

	tap.same(ECS.getEntities(w, [ 'dupe' ], 'removed'), [ e8 ], 'multiple removals only appear once in the removed list')
	tap.same(w.deferredRemovals.components, [ '0__@@ECS@@__dupe' ], 'multiple removals only appear once in the removed list')

	ECS.cleanup(w)
	
	tap.same(w.deferredRemovals.components, [ ])
}


{
	const w = ECS.createWorld()

	const e = ECS.createEntity(w)

	ECS.addComponentToEntity(w, e, 'aabb', { abc: true })
	ECS.addComponentToEntity(w, e, 'transform')

	tap.equal(ECS.getEntities(w, [ 'aabb' ]).length, 1)

	const deferredRemoval = false
	ECS.removeComponentFromEntity(w, e, 'aabb', deferredRemoval)

	tap.equal(ECS.getEntities(w, [ 'aabb' ]).length, 0)
	tap.same(w.entities, [ { transform: {} } ], 'immediately remove component from entity')
	tap.same(w.deferredRemovals, { entities: [ ], components: [ ] }, 'does not include the component in the deferred removal list')
	tap.same(w.stats.componentCount, { aabb: 0, transform: 1 }, 'immediately adjusts component stats')
}


// removing component named 'A' should not break filter for component 'AB'
{
	const w = ECS.createWorld()
	const e = ECS.createEntity(w)

	ECS.addComponentToEntity(w, e, 'tilda')
	ECS.addComponentToEntity(w, e, 'matilda')
	tap.equal(ECS.getEntities(w, [ 'matilda' ]).length, 1)

	const deferredRemoval = false
	ECS.removeComponentFromEntity(w, e, 'tilda', deferredRemoval)

	tap.equal(ECS.getEntities(w, [ 'matilda' ]).length, 1)
}
