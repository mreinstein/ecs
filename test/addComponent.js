import ECS from '../ecs.js'
import { test } from 'node:test'
import assert from 'node:assert/strict'


test('addComponent adds component data to entity', function () {
	const w = ECS.addWorld()

	const e = ECS.addEntity(w)

	ECS.addComponent(w, e, 'position', { x: 4, y: 12 })

	assert.deepEqual(w.entities, [ { position: { x: 4, y: 12 } } ])
})


test('adds are not lost when a system queries for a component before any are present', function () {
	const w = ECS.addWorld()
	const e = ECS.addEntity(w)

	ECS.addComponent(w, e, 'dupe')

	ECS.cleanup(w)

	const result = {
		count: 0,
		entries: new Array(1000)
	}

	ECS.getEntities(w, [ 'dupe' ], 'added', result)
	assert.deepEqual(result.entries[0], e, 'mocked system 1')

	ECS.cleanup(w)

	ECS.getEntities(w, [ 'dupe' ], 'added', result)
	assert.deepEqual(result.count, 0, 'mocked system 1')
})
