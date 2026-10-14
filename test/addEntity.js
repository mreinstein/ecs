import ECS from '../ecs.js'
import { test } from 'node:test'
import assert from 'node:assert/strict'


test('addEntity adds entity to world', function () {
	const w = ECS.addWorld()

	const e = ECS.addEntity(w)

	assert.deepEqual(w.entities, [ e ])
})
