# ecs
data oriented, functional entity component system.


## usage example

This is a minimal example of what you can do with `ecs`, illustrating how to declare
your components, systems, and entities.

```javascript
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
    // declare a filter that is used at run time to choose which entities to operate on
    // the 2nd argument is all of the required component types the entity must have to
    // be included
    const moveableFilter = ECS.createFilter(world, [ MOVEABLE ])

    // called each game loop
    const onUpdate = function () {
        // get all of the entities in the world that pass the filter
        for (const entity of ECS.getEntities(world, moveableFilter)) {
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
    const positionMoveFilter = ECS.createFilter(world, [ POSITION, MOVEABLE ])

    const onUpdate = function () {
        for (const entity of ECS.getEntities(world, positionMoveFilter)) {
            entity.position.x += entity.moveable.dx
            entity.position.y += entity.moveable.dy
        }
    }

    return { onUpdate }
}


ECS.addSystem(world, keyboardControlSystem)
ECS.addSystem(world, movementSystem)


function gameLoop () {
    // run onUpdate for all added systems
    ECS.update(world);

    requestAnimationFrame(gameLoop);
}


// finally start the game loop
gameLoop()
```
