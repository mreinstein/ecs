import ECS from './index.js'
import tap from 'tap'


const world = ECS.createWorld()

const POSITION = ECS.createComponentType(world, 'position', { x: 0, y: 0 })
const HEALTH = ECS.createComponentType(world, 'health', { current: 5, max: 5 })
const FROZEN = ECS.createComponentType(world, 'frozen', { label: 'brrr, I am frozen!' })

const PLAYER = ECS.createEntity(world)
ECS.addComponentToEntity(world, PLAYER, POSITION)
ECS.addComponentToEntity(world, PLAYER, HEALTH)


const MONSTER = ECS.createEntity(world)
ECS.addComponentToEntity(world, MONSTER, POSITION)
ECS.addComponentToEntity(world, MONSTER, HEALTH)
ECS.addComponentToEntity(world, MONSTER, FROZEN)

const moveableFilter = ECS.createFilter(world, [ POSITION, HEALTH ])


//console.log(JSON.stringify(world, null, 2))
/*
const e = ECS.getEntities(world, moveableFilter)

const p = ECS.getComponents(world, PLAYER)
p.position.x = 4
p.position.y = 34
*/
//console.log('player components', ECS.getComponents(world, PLAYER))

//ECS.removeEntity(world, MONSTER)
//ECS.removeComponentFromEntity(world, MONSTER, FROZEN)


function testSystem (world) {
	const frozenFilter = ECS.createFilter(world, [ FROZEN ])

	const onUpdate = function () {
		//const dt = ut.Time.deltaTime()
		const f = ECS.getEntities(world, frozenFilter)
		console.log('frozen entities:', f)
	}

	return { onUpdate }
}



ECS.addSystem(world, testSystem)


//console.log(ECS.getEntities(world, moveableFilter))

setInterval(function() {
	ECS.update(world)
}, 3000)

setTimeout(function () {
	console.log('removeing')
	ECS.removeComponentFromEntity(world, MONSTER, FROZEN)
}, 9000)
