# ecs
data oriented, functional entity component system


## usage example

This is a minimal example of what you can do with `ecs`. It's not functional but
illustrates how to declare your components, systems, and entities.

```javacript
import ECS      from 'ecs'
import Keyboard from './my/game/keyboard.js'
import clamp    from 'clamp'


// generates a new entity component system
const world = ECS.createWorld() 


// define a component type named position and give it a default value
const POSITION = ECS.createComponentType(world, 'position', { x: 0, y: 0 })

// define another component type named moveable
const MOVEABLE = ECS.createComponentType(world, 'moveable', { dx: 0, dy: 0 })

// set up the player
const PLAYER = ECS.createEntity(world)
ECS.addComponentToEntity(world, PLAYER, POSITION)
ECS.addComponentToEntity(world, PLAYER, MOVEABLE)


// update entity velocity based on key pressed
function keyboardControlSystem (world) {
	const moveableFilter = ECS.createFilter(world, [ MOVEABLE ])

    // called each game loop
    const onUpdate = function () {
    	// get all of the entities in the world that have a moveable component
    	for (const entity of ECS.getEntities(world, moveFilter)) {
	        // update the entity position according to what is pressed
	        if (Keyboard.keyPressed('up'))
	        	entity.moveable.dy -= 1;
	        if (Keyboard.keyPressed('down'))
	        	entity.moveable.dy += 1;
	        if (Keyboard.keyPressed('left'))
	        	entity.moveable.dx -= 1;
	        if (Keyboard.keyPressed('right'))
	        	entity.moveable.dx += 1;

	       entity.moveable.dx = clamp(entity.moveable.dx, -10, 10);
	       entity.moveable.dy = clamp(entity.moveable.dy, -10, 10);
	    }
    }

    return { onUpdate }
}


function movementSystem (world) {
	const moveFilter = ECS.createFilter(world, [ POSITION, MOVEABLE ])

	const onUpdate = function () {
		// get all of the entities in the world that can be moved
		for (const entity of ECS.getEntities(world, moveFilter)) {
			entity.position.x += entity.moveable.dx
			entity.position.y += entity.moveable.dy
		}
	}

	return { onUpdate }
}


ECS.addSystem(world, keyboardControlSystem)
ECS.addSystem(world, movementSystem)


function gameLoop() {
    // iterate through entities and apply elligible system
    ECS.update(world);

    requestAnimationFrame(gameLoop);
}


// finally start the game loop
gameLoop()
```
