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

	tap.same(ECS.getEntities(w, [ 'dupe' ], 'added'), [ ], 'mocked system 1')

	ECS.addComponentToEntity(w, e, 'dupe')

	tap.same(ECS.getEntities(w, [ 'dupe' ], 'added'), [ ], 'mocked system 2')

	ECS.cleanup(w)

	tap.same(ECS.getEntities(w, [ 'dupe' ], 'added'), [ e ], 'mocked system 1')
	tap.same(ECS.getEntities(w, [ 'dupe' ], 'added'), [ e ], 'mocked system 2')

	ECS.cleanup(w)

	tap.same(ECS.getEntities(w, [ 'dupe' ], 'added'), [ ], 'mocked system 1')
	tap.same(ECS.getEntities(w, [ 'dupe' ], 'added'), [ ], 'mocked system 2')
}


// when a system doesn't query for a component until after it's been added, don't lose add events
{
	const w = ECS.createWorld()
	const e = ECS.createEntity(w)

	ECS.addComponentToEntity(w, e, 'dupe')
	tap.same(ECS.getEntities(w, [ 'dupe' ], 'added'), [ e ], 'mocked system 1')
	tap.same(ECS.getEntities(w, [ 'dupe' ], 'added'), [ e ], 'mocked system 2')
	tap.same(ECS.getEntities(w, [ 'dupe' ], 'added'), [ e ], 'mocked system 3')

	ECS.cleanup(w)

	tap.same(ECS.getEntities(w, [ 'dupe' ], 'added'), [ ], 'mocked system 1')
	tap.same(ECS.getEntities(w, [ 'dupe' ], 'added'), [ ], 'mocked system 2')
	tap.same(ECS.getEntities(w, [ 'dupe' ], 'added'), [ ], 'mocked system 3')
}


{
	const w = ECS.createWorld()
	const e = ECS.createEntity(w)

	ECS.addComponentToEntity(w, e, 'dupe')
	ECS.addComponentToEntity(w, e, 'dupe')
	ECS.addComponentToEntity(w, e, 'dupe')
	ECS.addComponentToEntity(w, e, 'dupe')

	tap.same(ECS.getEntities(w, [ 'dupe' ], 'added'), [ e ], 'multiple additions only appear once in the added list')

	ECS.cleanup(w)

	tap.same(ECS.getEntities(w, [ 'dupe' ], 'added'), [ ])
}


// adding component to entity should not fire obsolete listeners
// details discussed here https://github.com/mreinstein/ecs/issues/22
{
	const w = ECS.createWorld()
	const entity = ECS.createEntity(w)

	ECS.addComponentToEntity( w, entity, 'A')
	ECS.addComponentToEntity( w, entity, 'C')
	tap.equal(ECS.getEntities(w, [ 'A','C' ],'added').length, 1)

	ECS.cleanup(w)
	tap.equal(ECS.getEntities(w, [ 'A','C' ],'added').length, 0)


	ECS.removeComponentFromEntity( w, entity, 'A')
	ECS.addComponentToEntity( w, entity, 'B')
	ECS.cleanup(w)
	tap.equal(ECS.getEntities(w, [ 'A','C' ],'added').length, 0)

	// TODO: maybe remove this to the remove component tests
	//tap.equal(ECS.getEntities(w, [ 'A','C' ],'removed').length, 1)
}
