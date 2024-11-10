import ECS from '../ecs.js'
import tap from 'tap'


{
	const w = ECS.addWorld()

	const e = ECS.addEntity(w)

	tap.equal(w.entities.length, 1)

	const someNonEntity = { }
	ECS.removeEntity(w, someNonEntity)

	tap.equal(w.entities.length, 1, 'removing some other random object doesnt have any effect')

	ECS.removeEntity(w, e)


	tap.same(w.deferredRemovals.entities.values().next().value, e, 'entity is added to deferred entity remove list')

	ECS.cleanup(w) // process deferred removals
	tap.equal(w.entities.length, 0, 'entity gets removed from the world')
}


{
	const w = ECS.addWorld()

	const e = ECS.addEntity(w)

	ECS.getEntities(w, [ 'a' ])  // filter 1
	ECS.getEntities(w, [ 'a', 'b' ])

	ECS.addComponent(w, e, 'a', { a: 23 })
	ECS.addComponent(w, e, 'b', { b: 64 })

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
	const w2 = ECS.addWorld()

	const e3 = ECS.addEntity(w2)
	ECS.addComponent(w2, e3, 'position', 'e3')

	const e4 = ECS.addEntity(w2)
	ECS.addComponent(w2, e4, 'position', 'e4')

	const e5 = ECS.addEntity(w2)
	ECS.addComponent(w2, e5, 'position', 'e5')

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


	const w3 = ECS.addWorld()

	const e6 = ECS.addEntity(w3)
	ECS.addComponent(w3, e6, 'position')

	ECS.getEntities(w3, [ 'position' ], 'removed')

	ECS.removeEntity(w3, e6)
	ECS.removeEntity(w3, e6)
	ECS.removeEntity(w3, e6)

	tap.same(w3.deferredRemovals.entities.values().next().value, e6)

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
	const w = ECS.addWorld()

	const e = ECS.addEntity(w)
	ECS.addComponent(w, e, 'testc')

	tap.equal(ECS.getEntities(w, [ 'testc' ]).length, 1, '1 entity should be present')

	const deferredRemoval = false
	ECS.removeEntity(w, e, deferredRemoval)

	tap.equal(ECS.getEntities(w, [ 'testc' ]).length, 0, 'no entities present because of immediate removal')
}


{
	// removing an entity immediately doesn't screw up removing other entities via deferred removal
	const w = ECS.addWorld()

	const e = ECS.addEntity(w)
	ECS.addComponent(w, e, 'e1')

	const e2 = ECS.addEntity(w)
	ECS.addComponent(w, e2, 'e2')

	const e3 = ECS.addEntity(w)
	ECS.addComponent(w, e3, 'e3')

	ECS.cleanup(w)

	ECS.removeEntity(w, e3)

	const deferredRemoval = false
	ECS.removeEntity(w, e2, deferredRemoval)

	ECS.cleanup(w)
	
	tap.same(w.entities, [ e ], 'none deferred entity removal does not interfere with regular deferred entity removal')
}


{
	// defer remove an entity, then remove it immediately. Prior to cleanup should empty the deferredRemovals set.

	const w = ECS.addWorld()

	const e = ECS.addEntity(w)
	ECS.addComponent(w, e, 'derp')

	ECS.cleanup(w)

	ECS.removeEntity(w, e, true)

	tap.equal(w.deferredRemovals.entities.size, 1)

	ECS.removeEntity(w, e, false)

	tap.equal(w.deferredRemovals.entities.size, 0)
	tap.equal(w.deferredRemovals.components.length, 0)
	tap.equal(w.listeners.removed.size, 0)
	tap.equal(w.listeners._removed.size, 1)

	ECS.cleanup(w)

	tap.equal(w.deferredRemovals.entities.size, 0)
	tap.equal(w.deferredRemovals.components.length, 0)
	tap.equal(w.listeners.removed.size, 1)
	tap.equal(w.listeners._removed.size, 0)
}


{
	// remove an entity immediately, then deferred remove it. Should still provide listners

	const w = ECS.addWorld()

	const e = ECS.addEntity(w)

	ECS.cleanup(w)

	ECS.removeEntity(w, e, false) // non-deferred removal (instant)

	ECS.removeEntity(w, e, true)  // deferred removal

	tap.equal(w.deferredRemovals.entities.size, 0)
	tap.equal(w.deferredRemovals.components.length, 0)

	tap.equal(w.listeners.added.size, 1)
	tap.equal(w.listeners._removed.size, 1)

	ECS.cleanup(w)
}


{
	// remove all values from the deferredRemovals.components list for an entity we just insta-removed

	const w = ECS.addWorld()

	const e = ECS.addEntity(w)

	ECS.addComponent(w, e, 'a')
	ECS.addComponent(w, e, 'b')

	ECS.cleanup(w)

	ECS.removeComponent(w, e, 'a')
	ECS.removeComponent(w, e, 'b')
	const deferredRemoval = false
	ECS.removeEntity(w, e, deferredRemoval)

	tap.equal(w.deferredRemovals.components.length, 0)
	tap.equal(w.deferredRemovals.entities.size, 0)

	ECS.cleanup(w)
}

{
    // Test removeEntities function with 'not' filter support
    const w = ECS.addWorld();

    const e1 = ECS.addEntity(w);
    ECS.addComponent(w, e1, 'ephemeral', {});

    const e2 = ECS.addEntity(w);
    ECS.addComponent(w, e2, 'ephemeral', {});
    ECS.addComponent(w, e2, 'health', { hp: 100 });

    const e3 = ECS.addEntity(w);
    ECS.addComponent(w, e3, 'transform', {});
    ECS.addComponent(w, e3, 'health', { hp: 100 });

    tap.equal(w.entities.length, 3, '3 entities should be present initially');

    // Remove all entities with 'ephemeral' component
    ECS.removeEntities(w, ['ephemeral']);
    ECS.cleanup(w); // process deferred removals
    tap.equal(w.entities.length, 1, 'only 1 entity should remain after removing all entities with "ephemeral"');

    // Add entities again for next test
    const e4 = ECS.addEntity(w);
    ECS.addComponent(w, e4, 'transform', {});
    ECS.addComponent(w, e4, 'ephemeral', {});

    const e5 = ECS.addEntity(w);
    ECS.addComponent(w, e5, 'transform', {});
    ECS.addComponent(w, e5, 'health', { hp: 100 });

    tap.equal(w.entities.length, 3, '3 entities should be present after adding new entities');

    // Remove entities with 'transform' but not 'health'
    ECS.removeEntities(w, ['transform', '!health']);
    ECS.cleanup(w); // process deferred removals
    tap.equal(w.entities.length, 2, '2 entities should remain after removing entities with "transform" but not "health"');
}
