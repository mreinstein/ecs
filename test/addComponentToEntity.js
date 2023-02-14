import ECS from '../ecs.js'
import tap from 'tap'


const w = ECS.createWorld()

const e = ECS.createEntity(w)

ECS.addComponentToEntity(w, e, 'position', { x: 4, y: 12 })

tap.same(w.entities, [ { position: { x: 4, y: 12 } } ])


// adds are not lost when a system queries for a component before any are present
{
	const w = ECS.createWorld()
	const e = ECS.createEntity(w)

	ECS.addComponentToEntity(w, e, 'dupe')

	ECS.cleanup(w)

	const result = {
		count: 0,
		entries: new Array(1000)
	}

	ECS.getEntities(w, [ 'dupe' ], 'added', result)
	tap.same(result.entries[0], e, 'mocked system 1')

	ECS.cleanup(w)

	ECS.getEntities(w, [ 'dupe' ], 'added', result)
	tap.same(result.count, 0, 'mocked system 1')
}
