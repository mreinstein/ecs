import ECS from '../ecs.js'
import tap from 'tap'


const w = ECS.createWorld()


function boringSystem (world) {
	return {
		onFixedUpdate: function () { },
		onUpdate: function () { }
	}
}

ECS.addSystem(w, boringSystem)

tap.equal(w.systems.length, 1)



ECS.addSystem(w, function (world) { return { } })

tap.equal(w.systems.length, 2)
tap.type(w.systems[1].onUpdate, 'function', 'noop function added if none provided')
tap.type(w.systems[1].onFixedUpdate, 'function', 'noop function added if none provided')
