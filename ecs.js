import orderedInsert from './ordered-insert.js'
import removeItems   from 'remove-array-items'


const now = (typeof performance === 'undefined') ? (() => Date.now()) : (() => performance.now())


function createWorld (worldId=Math.ceil(Math.random() * 999999999) ) {
    const world = {
        entities: [ ],
        filters: { },
        systems: [ ],
        listeners: {
            added: { },  // key is the filter, value is the array of entities added this frame
            removed: { } // key is the filter, value is the array of entities removed this frame
        },
        removals: {
            entities: [ ], // indexes into entities array, sorted from highest to lowest
            components: [ ] // [ entity index, component name ] pairs sorted from highest to lowest
        },

        stats: {
            // TODO: send world id to support multiple ecs worlds per page
            /*worldId, */
            entityCount: 0,
            componentCount: { }, // key is component id, value is instance count
            filterInvocationCount: { }, // key is filter id, value is number of times this filter was run this frame
            systems: [
                /*
                {
                    name: 'systemname',
                    timeElapsed: 0, // milliseconds spent in this system this frame
                    filters: {
                        filterId1: 0,  // number of entities that matched the filter
                        filterId2: 0,
                    }
                }
                */
            ],

            // the array index of the currently processed system
            // used to determine which systems invoke queries
            currentSystem: 0,

            lastSendTime: 0, // time stats were last sent (used to throttle send)
        }
    }

    if ((typeof window !== 'undefined') && window.__MREINSTEIN_ECS_DEVTOOLS) {
        window.postMessage({
            id: 'mreinstein/ecs-source',
            method: 'worldCreated',
            data: world.stats,
        }, '*');
    }

    return world
}


function createEntity (world) {
    const entity = { }
    world.entities.push(entity)
    world.stats.entityCount++
    return entity
}


function addComponentToEntity (world, entity, componentName, componentData={}) {

    // ignore duplicate adds
    if (entity[componentName])
        return

    if (!Number.isInteger(world.stats.componentCount[componentName]))
        world.stats.componentCount[componentName] = 0

    if (!entity[componentName])
        world.stats.componentCount[componentName] += 1

    entity[componentName] = componentData

    // add this entity to any filters that match
    for (const filterId in world.filters) {
        const matches = _matchesFilter(filterId, entity)

        const filter = world.filters[filterId]
        const idx = filter.indexOf(entity)
        if (idx >= 0) {
            // filter already contains entity and the filter doesn't match the entity, remove it
            if (!matches)
                removeItems(filter, idx, 1)
        } else {
            // filter doesn't contain the entity yet, and it's not included yet, add it
            if (matches)
                filter.push(entity)
        }
    }

    for (const filterId in world.listeners.added) {
        const matches = _matchesFilter(filterId, entity)

        // if the entity matches the filter and isn't already in the added list, add it
        const list = world.listeners.added[filterId]
        if (matches && !list.includes(entity))
            list.push(entity)
    }
}


function removeComponentFromEntity (world, entity, componentName, deferredRemoval=true) {
    // ignore removals when the component isn't present
    if (!entity[componentName])
        return

    // get list of all remove listeners that we match
    const matchingRemoveListeners = [ ]
    for (const filterId in world.listeners.removed) {
        // if an entity matches a remove filter, but then no longer matches the filter after a component
        // is removed, it should be flagged as removed in listeners.removed
        if (_matchesFilter(filterId, entity) && !_matchesFilter(filterId, entity, [ componentName ]))
            // prevent adding the removal of an entity to the same list multiple times
            if (!world.listeners.removed[filterId].includes(entity))
                world.listeners.removed[filterId].push(entity)
    }

    if (deferredRemoval) {
        // add this component to the list of deferred removals
        const idx = world.entities.indexOf(entity)
        const removalKey = `${idx}__@@ECS@@__${componentName}`

        if (!world.removals.components.includes(removalKey))
            world.removals.components.push(removalKey)
    } else {
        _removeComponent(world, entity, componentName)
    }
}


function removeEntity (world, entity) {
    const idx = world.entities.indexOf(entity)
    if (idx < 0)
        return

    // add the entity to all matching remove listener lists
    for (const filterId in world.listeners.removed) {
        const matches = _matchesFilter(filterId, entity)

        // if the entity matches the filter and isn't already in the removed list, add it
        const list = world.listeners.removed[filterId]
        if (matches && !list.includes(entity))
            list.push(entity)
    }

    // add this entity to the list of deferred removals
    if (!world.removals.entities.includes(idx)) {
        orderedInsert(world.removals.entities, idx)
        world.stats.entityCount--
    }
}


function getEntities (world, componentNames, listenerType) {
    const filterId = componentNames.join(',')

    if (!world.filters[filterId])
        world.filters[filterId] = world.entities.filter((e) => _matchesFilter(filterId, e))

    if (!world.stats.filterInvocationCount[filterId])
        world.stats.filterInvocationCount[filterId] = 0

    world.stats.filterInvocationCount[filterId] += 1;

    const systemIdx = world.stats.currentSystem
    if (world.stats.systems[systemIdx]) {
        if (!world.stats.systems[systemIdx].filters[filterId])
            world.stats.systems[systemIdx].filters[filterId] = 0

        world.stats.systems[systemIdx].filters[filterId] += world.filters[filterId].length
    }

    if (listenerType === 'added') {
        // if the filter doesn't exist yet, add it
        if (!world.listeners.added[filterId]) {
            world.listeners.added[filterId] = [ ]
            // add all existing entities that are already matching to the added event
            for (const entity of world.entities) {
                if (_matchesFilter(filterId, entity))
                    world.listeners.added[filterId].push(entity)
            }
        }

        return world.listeners.added[filterId]
    }

    if (listenerType === 'removed') {
        // if the filter doesn't exist yet, remove it
        if (!world.listeners.removed[filterId])
            world.listeners.removed[filterId] = [ ]

        return world.listeners.removed[filterId]
    }

    return world.filters[filterId]
}


// returns true if an entity contains all the components that match the filter
function _matchesFilter (filterId, entity, componentIgnoreList=[]) {
    const componentIds = filterId.split(',')

    // if the entity lacks any components in the filter, it's not in the filter
    for (const componentId of componentIds) {
        const isIgnored = componentIgnoreList.includes(componentId)
        if (isIgnored)
            return false

        if (componentId.startsWith('!') && entity[componentId.slice(1)])
            return false

        if (!componentId.startsWith('!') && !entity[componentId])
            return false
    }

    return true
}


function addSystem (world, fn) {
    const system = fn(world)

    world.stats.systems.push({
        name: fn.name || 'anonymousSystem',
        timeElapsed: 0, // milliseconds spent in this system this frame
        // key is filterId, value is number of entities that matched the filter
        filters: { }
    })

    if (!system.onFixedUpdate)
        system.onFixedUpdate = function () { }

    if (!system.onPreUpdate)
        system.onPreUpdate = function () { }

    if (!system.onUpdate)
        system.onUpdate = function () { }

    if (!system.onPostUpdate)
        system.onPostUpdate = function () { }

    world.systems.push(system)
}


function fixedUpdate (world, dt) {
    for (let i=0; i < world.systems.length; i++) {
        world.stats.currentSystem = i
        const system = world.systems[i]
        const start = now()
        system.onFixedUpdate(dt)
        world.stats.systems[i].timeElapsed += (now() - start)
    }
}


function preUpdate (world, dt) {
    for (let i=0; i < world.systems.length; i++) {
        world.stats.currentSystem = i
        const system = world.systems[i]
        const start = now()
        system.onPreUpdate(dt)
        world.stats.systems[i].timeElapsed += (now() - start)
    }
}


function update (world, dt) {
    for (let i=0; i < world.systems.length; i++) {
        world.stats.currentSystem = i
        const system = world.systems[i]
        const start = now()
        system.onUpdate(dt)
        world.stats.systems[i].timeElapsed += (now() - start)
    }
}


function postUpdate (world, dt) {
    for (let i=0; i < world.systems.length; i++) {
        world.stats.currentSystem = i
        const system = world.systems[i]
        const start = now()
        system.onPostUpdate(dt)
        world.stats.systems[i].timeElapsed += (now() - start)
    }
}


// remove all entities that were added/removed this frame from the listener set
// should be called after postUpdate
function emptyListeners (world) {
    for (const filterId in world.listeners.added)
        world.listeners.added[filterId].length = 0

    for (const filterId in world.listeners.removed)
        world.listeners.removed[filterId].length = 0
}


function _resetStats (world) {
    for (const filterId in world.stats.filterInvocationCount)
        world.stats.filterInvocationCount[filterId] = 0

    for (const system of world.stats.systems) {
        system.timeElapsed = 0
        for (const filterId in system.filters)
            system.filters[filterId] = 0
    }

    world.stats.currentSystem = 0
}


function _removeComponent (world, entity, componentName) {
    if (entity[componentName])
        world.stats.componentCount[componentName] -= 1

    delete entity[componentName]

    // remove this entity from any filters that no longer match
    for (const filterId in world.filters) {
        const filter = world.filters[filterId]

        if (_matchesFilter(filterId, entity) && !filter.includes(entity)) {
            // entity matches filter and it's not in the filter add it
            filter.push(entity)
        } else if (filterId.includes(componentName)) {
            // entity doesn't match filter and it's in the filter remove it
            // this filter contains the removed component
            const filterIdx = filter.indexOf(entity)
            if (filterIdx >= 0)
                removeItems(filter, filterIdx, 1)
        }
    }
}


function cleanup (world) {
    emptyListeners(world)

    // process all entity components marked for deferred removal
    for (let i=0; i < world.removals.components.length; i++) {
        const [ entityIdx, componentName ] = world.removals.components[i].split('__@@ECS@@__')
        const entity = world.entities[entityIdx]
        _removeComponent(world, entity, componentName)
    }

    world.removals.components.length = 0


    // process all entities marked for deferred removal
    for (const entityIdx of world.removals.entities) {
        const entity = world.entities[entityIdx]

        for (const componentName in entity)
            if (entity[componentName])
                world.stats.componentCount[componentName] -= 1

        removeItems(world.entities, entityIdx, 1)

        // update all filters that match this
        for (const filterId in world.filters) {
            const filter = world.filters[filterId]
            const idx = filter.indexOf(entity)
            if (idx >= 0)
                removeItems(filter, idx, 1)
        }
    }

    world.removals.entities.length = 0

    if ((typeof window !== 'undefined') && window.__MREINSTEIN_ECS_DEVTOOLS) {
        // running at 60fps seems to queue up a lot of messages. I'm thinking it might just be more
        // data than postMessage can send. capping it at some lower update rate seems to work better.
        // for now capping this at 4fps. later we might investigate if sending deltas over postmessage
        // solves the message piling up problem.
        if (performance.now() - world.stats.lastSendTime > 250) {
            world.stats.lastSendTime = performance.now();
            window.postMessage({
                id: 'mreinstein/ecs-source',
                method: 'refreshData',
                data: world.stats,
            }, '*');
        }
    }

    setTimeout(_resetStats, 0, world) // defer reset until next frame
}


export default { createWorld, createEntity, addComponentToEntity, removeComponentFromEntity, getEntities,
                 removeEntity, addSystem, fixedUpdate, update, preUpdate, postUpdate, cleanup }
