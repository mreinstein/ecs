import ECS from '../ecs.js'
import tap from 'tap'


const w = ECS.createWorld()

const e = ECS.createEntity(w)

ECS.addComponentToEntity(w, e, 'position', { x: 4, y: 12 })

tap.same(w.entities, [ { position: { x: 4, y: 12 } } ])




const w3 = ECS.createWorld()

const entities6 = ECS.getEntities(w3, [ 'dupe' ], 'added')

const e8 = ECS.createEntity(w3)

ECS.addComponentToEntity(w3, e8, 'dupe')
ECS.addComponentToEntity(w3, e8, 'dupe')
ECS.addComponentToEntity(w3, e8, 'dupe')
ECS.addComponentToEntity(w3, e8, 'dupe')

tap.same(ECS.getEntities(w3, [ 'dupe' ], 'added'), [ e8 ], 'multiple additions only appear once in the added list')


///////////////////////////////////////////
// adding component to entity should not fire obsolete listeners
// details discussed here https://github.com/mreinstein/ecs/issues/22
{
const w = ECS.createWorld()
const entity = ECS.createEntity(w)

tap.equal(ECS.getEntities(w, [ 'A','C' ],'added').length, 0)
ECS.addComponentToEntity( w, entity, 'A')
ECS.addComponentToEntity( w, entity, 'C')
tap.equal(ECS.getEntities(w, [ 'A','C' ],'added').length, 1)
ECS.cleanup( w );

tap.equal(ECS.getEntities(w, [ 'A','C' ],'added').length, 0)
ECS.removeComponentFromEntity( w, entity, 'A')
ECS.addComponentToEntity( w, entity, 'B')
tap.equal(ECS.getEntities(w, [ 'A','C' ],'added').length, 0)
}
