import ECS from '../ecs.js'
import { test } from 'node:test'
import assert from 'node:assert/strict'


test('addSystem', function () {
	const w = ECS.addWorld()


	function boringSystem (world) {
		return {
			onFixedUpdate: function () { },
			onUpdate: function () { }
		}
	}

	ECS.addSystem(w, boringSystem)

	assert.equal(w.systems.length, 1)



	ECS.addSystem(w, function (world) { return { } })

	assert.equal(w.systems.length, 2)
	assert.equal(typeof w.systems[1].onUpdate, 'function', 'noop function added if none provided')
	assert.equal(typeof w.systems[1].onFixedUpdate, 'function', 'noop function added if none provided')
})
