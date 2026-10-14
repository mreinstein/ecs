import ECS from '../ecs.js'
import { test } from 'node:test'
import assert from 'node:assert/strict'


test('getEntities', function () {
	const w = ECS.addWorld()

	const entities = ECS.getEntities(w, [ 'position' ])

	assert.equal(w.filters.position.length, 0, 'querying a filter creates it the first time')



	const e = ECS.addEntity(w)

	ECS.addComponent(w, e, 'position', { x: 4, y: 12 })

	assert.deepEqual(w.filters.position, [ { position: { x: 4, y: 12 } } ], 'new entities are added to existing filters')



	ECS.getEntities(w, [ 'health' ])

	assert.equal(w.filters.health.length, 0, 'new filter starts out empty')

	const e2 = ECS.addEntity(w)
	ECS.addComponent(w, e2, 'health', { max: 10, current: 8 })

	assert.deepEqual(w.filters.health, [ e2 ], 'when adding components to entities makes them match existing filters, add them')



	const e3 = ECS.addEntity(w)
	ECS.addComponent(w, e3, 'a', { val: 10 })
	ECS.addComponent(w, e3, 'b', { val: 20 })

	assert.equal(1, ECS.getEntities(w, [ 'a', 'b' ]).length, 'order of components in filter does not matter')
	assert.equal(1, ECS.getEntities(w, [ 'b', 'a' ]).length, 'order of components in fitler does not matter')
})
