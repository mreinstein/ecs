import ECS from 'ecs'


const WIDGET_QUERY = [ 'widget' ]

const constants = {
	FIXED_STEP_MS: 16,  // fixed steps run @ 62.5fps (16ms per frame)
}

const Global = {
	world: undefined,  // ECS instance

	// timekeeping (in milliseconds)
    lastFrameTime: 0, // time the last frame ran
    accumulator: 0,   // accumulate time to run ticks at a fixed rate

    tick: 0, // total number of frames elapsed
}


async function main () {
	// init
	Global.world = ECS.addWorld()

	// add all of the game's systems
	ECS.addSystem(Global.world, widgetSpawnerSystem)
	ECS.addSystem(Global.world, scoreSystem)

	// start the simulation loop
	simLoop()
}


function simLoop () {
	const world = Global.world
	const { FIXED_STEP_MS } = constants 

	const newTime = performance.now()
    const frameTime = newTime - Global.lastFrameTime
    Global.lastFrameTime = newTime

    Global.accumulator += frameTime

    // reset accumulator when > 2 seconds of time has elapsed since last step
    // e.g., when the game window is restored after being hidden for a while
    if (Global.accumulator > 2000)
        Global.accumulator = 0

    // run the game's physics and logic in fixed timesteps (great for physics stability and network determinism)
    while (Global.accumulator >= FIXED_STEP_MS) {
        Global.accumulator -= FIXED_STEP_MS

        ECS.fixedUpdate(world, FIXED_STEP_MS)
        
        ECS.cleanup(world)

        Global.tick++
    }

	//requestAnimationFrame(simLoop)
	setTimeout(simLoop, 1000 / 60)
}


main()



function createWidgetEntity (world) {
	const w = ECS.addEntity(world)
	ECS.addComponent(world, w, 'widget', {
		frameTTL: 60, // after 60 frames this widget should be removed 
	})
}

// spawns new widgets entities

function widgetSpawnerSystem (world) {

    const onFixedUpdate = function (dt) {
    	// spawn 1 widget per 60 ticks
    	if (Global.tick % 60 === 0)
    		createWidgetEntity(world, Global.tick)

    	// remove any widgets that have expired
    	for (const e of ECS.getEntities(world, WIDGET_QUERY)) {
    		if (e.widget.frameTTL === 0)
    			ECS.removeEntity(world, e)
    		else
    			e.widget.frameTTL--
    	}
    }

    return { onFixedUpdate }
}


// imagine a system that calculates score based on how many widgets were added/removed on a given frame
function scoreSystem (world) {

	const result = {
		count: 0,
		entries: new Array(100),
	}

	const onFixedUpdate = function (dt) {
		ECS.getEntities(world, WIDGET_QUERY, 'added', result)
		if (result.count)
			console.log('widgets added:', result.count)

		ECS.getEntities(world, WIDGET_QUERY, 'removed', result)
		if (result.count)
			console.log('widgets removed:', result.count)

	}

	return { onFixedUpdate }
}

