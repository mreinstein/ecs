import ECS from '../ecs.js'
import { test } from 'node:test'
import assert from 'node:assert/strict'


test('listeners with not modifier', function () {
	const w = ECS.addWorld()

	const e = ECS.addEntity(w)

	ECS.addComponent(w, e, 'a')

	ECS.removeEntity(w, e)
	ECS.cleanup(w)

	const result = {
		count: 0,
		entries: new Array(1000)
	}

	const out = ECS.getEntities(w, [ 'a', '!b' ], 'removed', result)

	assert.deepEqual(out, result, 'getEntities returns the passed in listener entity data structure')

	assert.deepEqual(result.count, 1)
	assert.deepEqual(result.entries[0], e, 'removed entity is included since weve run cleanup() (removed last frame)')
})
