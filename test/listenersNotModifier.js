import ECS from '../ecs.js'
import tap from 'tap'


{
	const w = ECS.createWorld()

	const e = ECS.createEntity(w)

	ECS.addComponentToEntity(w, e, 'a')

	ECS.removeEntity(w, e)
	ECS.cleanup(w)

	const result = {
		count: 0,
		entries: new Array(1000)
	}

	const out = ECS.getEntities(w, [ 'a', '!b' ], 'removed', result)

	tap.same(out, result, 'getEntities returns the passed in listener entity data structure')

	tap.same(result.count, 1)
	tap.same(result.entries[0], e, 'removed entity is included since weve run cleanup() (removed last frame)')
}
