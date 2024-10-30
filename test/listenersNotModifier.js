import ECS from '../ecs.js'
import tap from 'tap'


{
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

	tap.same(out, result, 'getEntities returns the passed in listener entity data structure')

	tap.same(result.count, 1)
	tap.same(result.entries[0], e, 'removed entity is included since weve run cleanup() (removed last frame)')
}
