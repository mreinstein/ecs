import ECS from '../ecs.js'
import { test } from 'node:test'
import assert from 'node:assert/strict'


test('no match returns undefined', function () {
	const w = ECS.addWorld()

	const h = ECS.getEntity(w, [ 'hero' ])

	assert.equal(h, undefined)
})


test('finds 1 matching entity', function () {
	const w = ECS.addWorld()

	const e = ECS.addEntity(w)
	ECS.addComponent(w, e, 'hero')

	const h = ECS.getEntity(w, [ 'hero' ])

	assert.equal(h, e)
})


test('returns the first match even if there are more than one', function () {
	const w = ECS.addWorld()

	const e = ECS.addEntity(w)
	ECS.addComponent(w, e, 'hero')
	ECS.addComponent(w, e, 'a')

	const e2 = ECS.addEntity(w)
	ECS.addComponent(w, e2, 'hero')
	ECS.addComponent(w, e2, 'b')

	const h = ECS.getEntity(w, [ 'hero' ])

	assert.equal(h, e)
})
