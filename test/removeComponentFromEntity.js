import ECS from '../ecs.js'
import tap from 'tap'


const w = ECS.createWorld()

const e = ECS.createEntity(w)

ECS.addComponentToEntity(w, e, 'position', { x: 4, y: 12 })
ECS.addComponentToEntity(w, e, 'health', { health: 34 })

const e2 = ECS.createEntity(w)
ECS.addComponentToEntity(w, e2, 'health', { health: 34 })


const entities = ECS.getEntities(w, [ 'position' ])
const entities2 = ECS.getEntities(w, [ 'position', 'health' ])

tap.equal(entities.length, 1)
tap.equal(entities2.length, 1)

ECS.removeComponentFromEntity(w, e, 'position')
ECS.cleanup(w)

const entities3 = ECS.getEntities(w, [ 'position' ])
const entities4 = ECS.getEntities(w, [ 'position', 'health' ])
const entities5 = ECS.getEntities(w, [ 'health' ])

tap.equal(entities3.length, 0)
tap.equal(entities4.length, 0)
tap.equal(entities5.length, 2)



// while iterating over entities, removing a component from an unvisited entity still gets processed
// because the removal is defferred until the cleanup step

const w2 = ECS.createWorld()

const e3 = ECS.createEntity(w2)
ECS.addComponentToEntity(w2, e3, 'position', 'e3')

const e4 = ECS.createEntity(w2)
ECS.addComponentToEntity(w2, e4, 'position', 'e4')

const e5 = ECS.createEntity(w2)
ECS.addComponentToEntity(w2, e5, 'position', 'e5')

let i = 0
const processed = { }

for (const entity of ECS.getEntities(w2, [ 'position'])) {
	processed[entity.position] = true
	
	// while processing the first entity in the list, remove the 2nd entity
	if (i == 0)
		ECS.removeComponentFromEntity(w2, e4, 'position')

	i++
}

tap.same(processed, { e3: true, e4: true, e5: true }, 'all entities processed because of deferred component removal')




const w3 = ECS.createWorld()

const entities6 = ECS.getEntities(w3, [ 'dupe' ], 'removed')

const e8 = ECS.createEntity(w3)

ECS.addComponentToEntity(w3, e8, 'dupe', { abc: true })

ECS.cleanup(w3)


ECS.removeComponentFromEntity(w3, e8, 'dupe')
ECS.removeComponentFromEntity(w3, e8, 'dupe')
ECS.removeComponentFromEntity(w3, e8, 'dupe')

tap.same(ECS.getEntities(w3, [ 'dupe' ], 'removed'), [ e8 ], 'multiple removals only appear once in the removed list')
tap.same(w3.removals.components, [ '0__@@ECS@@__dupe' ], 'multiple removals only appear once in the removed list')
