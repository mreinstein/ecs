import ECS from '../ecs.js'
import { test } from 'node:test'
import assert from 'node:assert/strict'


test('generates integer ids and retrieves entities by id', function () {
	const w = ECS.addWorld()

	const e1 = ECS.addEntity(w)
	const e2 = ECS.addEntity(w)
	const e3 = ECS.addEntity(w)

	assert.equal(ECS.getEntityId(w, e1), 1, 'generates an integer id')
	assert.equal(ECS.getEntityId(w, e2), 2, 'generates an integer id')
	assert.equal(ECS.getEntityId(w, e3), 3, 'generates an integer id')

	assert.equal(e1, ECS.getEntityById(w, 1), 'retrieves entity by id')
	assert.equal(e2, ECS.getEntityById(w, 2), 'retrieves entity by id')
	assert.equal(e3, ECS.getEntityById(w, 3), 'retrieves entity by id')
})


test('immediate entity removal works as expected', function () {
	const w = ECS.addWorld()

	const e1 = ECS.addEntity(w)

	assert.equal(ECS.getEntityId(w, e1), 1, 'generates an integer id')
	assert.equal(e1, ECS.getEntityById(w, 1), 'retrieves entity by id')

	// removing an entity removes it's id

	const deferredRemoval = false
	ECS.removeEntity(w, e1, deferredRemoval)

	assert.equal(ECS.getEntityId(w, e1), undefined, 'entity id is removed')
	assert.equal(undefined, ECS.getEntityById(w, 1), 'entity is removed')
})


test('deferred entity removal works as expected', function () {
	const w = ECS.addWorld()

	const e1 = ECS.addEntity(w)

	assert.equal(ECS.getEntityId(w, e1), 1, 'generates an integer id')
	assert.equal(e1, ECS.getEntityById(w, 1), 'retrieves entity by id')

	// removing an entity removes it's id

	const deferredRemoval = true
	ECS.removeEntity(w, e1, deferredRemoval)

	// entity is still present because we haven't cleaned up yet
	assert.equal(ECS.getEntityId(w, e1), 1, 'entity id is removed')
	assert.equal(e1, ECS.getEntityById(w, 1), 'retrieves entity by id')

	ECS.cleanup(w)

	// now they should be gone
	assert.equal(ECS.getEntityId(w, e1), undefined, 'entity id is removed')
	assert.equal(undefined, ECS.getEntityById(w, 1), 'entity is removed')
})


test('entity id still increments despite entity removal', function () {
	const w = ECS.addWorld()

	const e1 = ECS.addEntity(w)
	const e2 = ECS.addEntity(w)
	const e3 = ECS.addEntity(w)

	const deferredRemoval = true

	ECS.removeEntity(w, e1, deferredRemoval)
	ECS.removeEntity(w, e2, deferredRemoval)
	ECS.removeEntity(w, e3, deferredRemoval)

	ECS.cleanup(w)
	
	const e4 = ECS.addEntity(w)
	assert.equal(ECS.getEntityId(w, e4), 4)
})
