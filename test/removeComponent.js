import ECS from '../ecs.js'
import tap from 'tap'


{
	const w = ECS.addWorld()

	const e = ECS.addEntity(w)

	ECS.addComponent(w, e, 'position', { x: 4, y: 12 })
	ECS.addComponent(w, e, 'health', { health: 34 })

	const e2 = ECS.addEntity(w)
	ECS.addComponent(w, e2, 'health', { health: 34 })


	const entities = ECS.getEntities(w, [ 'position' ])
	const entities2 = ECS.getEntities(w, [ 'position', 'health' ])

	tap.equal(entities.length, 1)
	tap.equal(entities2.length, 1)

	ECS.removeComponent(w, e, 'position')
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

	const w = ECS.addWorld()

	const e = ECS.addEntity(w)
	ECS.addComponent(w, e, 'position', 'p3')

	const e2 = ECS.addEntity(w)
	ECS.addComponent(w, e2, 'position', 'p4')

	const e3 = ECS.addEntity(w)
	ECS.addComponent(w, e3, 'position', 'p5')

	let i = 0
	const processed = { }

	for (const entity of ECS.getEntities(w, [ 'position'])) {
		processed[entity.position] = true
		
		// while processing the first entity in the list, remove the 2nd entity
		if (i == 0)
			ECS.removeComponent(w, e2, 'position')

		i++
	}

	tap.same(processed, { p3: true, p4: true, p5: true }, 'all entities processed because of deferred component removal')
}


{
	const w = ECS.addWorld()

	const e8 = ECS.addEntity(w)

	ECS.addComponent(w, e8, 'dupe', { abc: true })

	ECS.cleanup(w)

	ECS.removeComponent(w, e8, 'dupe')
	ECS.removeComponent(w, e8, 'dupe')
	ECS.removeComponent(w, e8, 'dupe')

	tap.same(ECS.getEntities(w, [ 'dupe' ], 'removed'), [ e8 ], 'multiple removals only appear once in the removed list')

	tap.same(w.deferredRemovals.components, [ [ e8, 'dupe' ] ], 'multiple removals only appear once in the removed list')

	ECS.cleanup(w)
	
	tap.same(w.deferredRemovals.components, [ ])
}


{
	const w = ECS.addWorld()

	const e = ECS.addEntity(w)

	ECS.addComponent(w, e, 'aabb', { abc: true })
	ECS.addComponent(w, e, 'transform')

	tap.equal(ECS.getEntities(w, [ 'aabb' ]).length, 1)

	const deferredRemoval = false
	ECS.removeComponent(w, e, 'aabb', deferredRemoval)

	tap.equal(ECS.getEntities(w, [ 'aabb' ]).length, 0)
	tap.same(w.entities, [ { transform: {} } ], 'immediately remove component from entity')
	tap.same(w.deferredRemovals, { entities: new Set(), components: [ ] }, 'does not include the component in the deferred removal list')
	tap.same(w.stats.componentCount, { aabb: 0, transform: 1 }, 'immediately adjusts component stats')
}


// removing component named 'A' should not break filter for component 'AB'
{
	const w = ECS.addWorld()
	const e = ECS.addEntity(w)

	ECS.addComponent(w, e, 'tilda')
	ECS.addComponent(w, e, 'matilda')
	tap.equal(ECS.getEntities(w, [ 'matilda' ]).length, 1)

	const deferredRemoval = false
	ECS.removeComponent(w, e, 'tilda', deferredRemoval)

	tap.equal(ECS.getEntities(w, [ 'matilda' ]).length, 1)
}


{
	// if we immediately remove an entity (non-deferred removal) then we re-process the 
	// world.deferredRemovals.components strings and shift up all the idx values > the idx of the removed entity

	const w = ECS.addWorld()

	const e = ECS.addEntity(w)

	const e2 = ECS.addEntity(w)
	
	ECS.addComponent(w, e2, 'hitHero')

	ECS.removeComponent(w, e2, 'hitHero')

	ECS.removeEntity(w, e, false)

	//console.error(w.deferredRemovals.components)

	ECS.cleanup(w)
}
