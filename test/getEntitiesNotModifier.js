import ECS from '../ecs.js'
import { test } from 'node:test'
import assert from 'node:assert/strict'


test('find all entities that have position but not flimflam', function () {
	const w = ECS.addWorld()

	const e = ECS.addEntity(w)
	ECS.addComponent(w, e, 'position', { x: 4, y: 12 })

	const e2 = ECS.addEntity(w)
	ECS.addComponent(w, e2, 'position', { x: 10, y: 0 })
	ECS.addComponent(w, e2, 'flimflam', { color: 'orange' })

	const entitiesNotted = ECS.getEntities(w, [ 'position', '!flimflam' ])
	assert.equal(entitiesNotted.length, 1)
	assert.deepEqual(entitiesNotted[0], e)
})


test('adding and then removing, then re-adding a component on an entity should filter correctly', function () {
	const w = ECS.addWorld()
	const w2 = ECS.addWorld()

	const e3 = ECS.addEntity(w2)
	ECS.addComponent(w, e3, 'a')

	const result = ECS.getEntities(w2, [ 'a', '!b' ])
	assert.equal(result.length, 1)
	assert.deepEqual(result[0], e3)


	ECS.addComponent(w2, e3, 'b')
	const result2 = ECS.getEntities(w2, [ 'a', '!b' ])
	assert.equal(result2.length, 0)

	ECS.removeComponent(w2, e3, 'b')

	ECS.cleanup(w2)


	const result3 = ECS.getEntities(w2, [ 'a', '!b' ])
	assert.equal(result3.length, 1)
})
