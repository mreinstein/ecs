import * as ComponentSet from './component-set.js'
import removeItems       from 'remove-array-items'


/**
 * @typedef { 'added' | 'removed' } ListenerType
 */

/**
 * @typedef { Entity[] } ListenerResult
 */

/**
 * @typedef { any } Component
 */

/**
 * @typedef {{
 *  [ key: string ]: Component
 * }} Entity
 */

/**
 * @typedef { Entity[] } FilteredEntityList
 */

/**
 * @typedef { (dt: number) => void } SystemUpdateFunction
 */

/**
 * @typedef { Object } System
 * @prop {SystemUpdateFunction} [onPreFixedUpdate]
 * @prop {SystemUpdateFunction} [onFixedUpdate]
 * @prop {SystemUpdateFunction} [onPostFixedUpdate]
 * @prop {SystemUpdateFunction} [onPreUpdate]
 * @prop {SystemUpdateFunction} [onUpdate]
 * @prop {SystemUpdateFunction} [onPostUpdate]
 */

/**
 * @typedef {{
 *   (world: World) => System
 * }} SystemFunction
 * @prop {string} [name] Name of the function. Defaults to "anonymousSystem"
 */

/**
 * @typedef { any } Listener
 */

/**
 * @typedef {{ [ key: string ]: Listener }} ListenerMap
 */

/**
 * @typedef { Object } ListenerChangeMap
 * @prop {ListenerMap} added 
 * @prop {ListenerMap} removed 
 */

/**
 * @typedef {{ [ filterId: string ]: FilteredEntityList }} FilterMap
 */

/**
 * @typedef { Object } DeferredRemovalMap
 * @prop {number[]} entities
 * @prop {string[]} components [ entity, component name ]
 */

/**
 * @typedef { Object } SystemStats
 * @prop {string} name
 * @prop {number} timeElapsed milliseconds spent in this system during the last completed frame
 * @prop {{ [ filterId: string ]: number }} filters key is filter id, value is the number of entities
 *   that matched the filter during the last completed frame
 * @prop {number} _timeElapsed internal: accumulates the in-progress frame's time
 * @prop {{ [ filterId: string ]: number }} _filters internal: accumulates the in-progress frame's filter matches
 */

/**
 * World stats. `entityCount` and `componentCount` are always current. The per-frame values
 * (`filterInvocationCount`, `systems[].timeElapsed`, `systems[].filters`) describe the last
 * completed frame: they're published by `cleanup()`, so they can be read at any time.
 *
 * @typedef { Object } WorldStats
 * @prop {number} entityCount
 * @prop {{ [ key: string ]: number }} componentCount key is component id, value is instance count
 * @prop {{ [ key: string ]: number }} filterInvocationCount key is filter id, value is number of
 *   times this filter was run during the last completed frame
 * @prop {{ [ key: string ]: number }} _filterInvocationCount internal: accumulates the in-progress frame's invocations
 * @prop {SystemStats[]} systems
 * @prop {number} currentSystem the array index of the currently processed system
 *   used to determine which systems invoke queries
 */

/**
 * @typedef { Object } World
 * @prop {Entity[]} entities 
 * @prop {FilterMap} filters 
 * @prop {System[]} systems 
 * @prop {ListenerChangeMap} listeners 
 * @prop {DeferredRemovalMap} deferredRemovals 
 * @prop {WorldStats} stats 
 */

/**
 * Creates a world
 *
 * @param {number} worldId ID of the world to create
 * @returns {World} created world
 */
export function createWorld (worldId=Math.ceil(Math.random() * 999999999) ) {
    /**
     * @type {World}
     */
    const world = {

        entityIds: new Map(), // maps both entityId -> entity, and entity -> entityId
        nextId: 1,  // id of the next entity to be created

        entities: [ ],
        filters: { },
        systems: [ ],
        listeners: {
            added: new Set(),  // entities added last frame
            removed: new Set(), // entities removed last frame

            // Buffer all entities added/removed this frame and report them as added/removed in the
            // next frame.  Fixes https://github.com/mreinstein/ecs/issues/35 where some events can
            // be missed depending on system order.
            _added: new Set(),
            _removed: new Set()
        },
        
        deferredRemovals: {
            entities: new Set(),
            components: ComponentSet.create() // [ entity, componentName ] pairs
        },

        stats: {
            // TODO: send world id to support multiple ecs worlds per page
            /*worldId, */
            entityCount: 0,
            componentCount: { }, // key is component id, value is instance count

            // per-frame stats. the public fields hold the last completed frame (published by
            // cleanup()), the _ prefixed fields accumulate the frame currently in progress.
            filterInvocationCount: { }, // key is filter id, value is number of times this filter was run
            _filterInvocationCount: { },
            systems: [
                /*
                example format:
                    {
                        name: 'systemname',
                        timeElapsed: 0, // milliseconds spent in this system
                        filters: {
                            filterId1: 0,  // number of entities that matched the filter
                            filterId2: 0,
                        },
                        _timeElapsed: 0,
                        _filters: { },
                    }
                */
            ],

            // the array index of the currently processed system
            // used to determine which systems invoke queries
            currentSystem: 0,
        }
    }

    return world
}


/**
 * Creates an entity and adds it to the world, incrementing the entity count
 * @param {World} world world where entity will be added
 * @returns {Entity} the created entity
 */
export function createEntity (world) {
    const entity = { }
    world.entities.push(entity)
    world.stats.entityCount++

    world.entityIds.set(world.nextId, entity)
    world.entityIds.set(entity, world.nextId)

    world.nextId++

    world.listeners._added.add(entity)
    return entity
}


export function getEntityId (world, entity) {
    return world.entityIds.get(entity)
}


export function getEntityById (world, entityId) {
    return world.entityIds.get(entityId)
}


/**
 * Adds a component to the entity
 * @param {World} world world where listener will be invoked
 * @param {Entity} entity 
 * @param {string} componentName 
 * @param {Component} [componentData] 
 * @returns {void} returns early if this is a duplicate componentName
 */
export function addComponentToEntity (world, entity, componentName, componentData={}) {

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
        } else if (matches) {
            // filter doesn't contain the entity yet, and it's not included yet, add it
            filter.push(entity)
        }
    }
}


/**
 * Removes a component from the entity, optionally deferring removal
 * @param {World} world world where listener will be invoked
 * @param {Entity} entity entity to remove component from
 * @param {string} componentName name of the component to remove
 * @param {boolean} [deferredRemoval] Default is true, optionally defer removal 
 * @returns {void} returns early if componentName does not exist on entity
 */
 export function removeComponentFromEntity (world, entity, componentName, deferredRemoval=true) {
    // ignore removals when the component isn't present
    if (!entity[componentName])
        return

    if (deferredRemoval) {
        // add the component to the list of components to remove when the cleanup function is invoked
        if (!ComponentSet.includes(world.deferredRemovals.components, entity, componentName))
            ComponentSet.add(world.deferredRemovals.components, entity, componentName)
    } else {
        _removeComponent(world, entity, componentName)
    }
}


/**
 * Remove an entity from the world
 * @param {World} world world to remove entity from and emit listeners
 * @param {Entity} entity entity to remove
 * @param {boolean} [deferredRemoval] Default is true, optionally defer removal 
 * @returns {void} returns early if entity does not exist in world
 */
 export function removeEntity (world, entity, deferredRemoval=true) {
    const idx = world.entities.indexOf(entity)
    if (idx < 0)
        return

    world.listeners._removed.add(entity)

    if (deferredRemoval) {
        // add the entity to the list of entities to remove when the cleanup function is invoked
        if (!world.deferredRemovals.entities.has(entity)) {
            world.deferredRemovals.entities.add(entity)
            world.stats.entityCount--
        }
    } else {
        _removeEntity(world, entity)
    }
}

/**
 * Remove entities from the world that match the given component criteria.
 * @param {World} world - The world containing the entities.
 * @param {string[]} componentNames - Array of component names to filter by.
 * Supports 'not' filters by prefixing component names with '!'.
 */
export function removeEntities(world, componentNames) {
    const entitiesToRemove = world.entities.filter((entity) => {
        for (const componentName of componentNames) {
            const isNotFilter = componentName.startsWith('!');
            const actualComponentName = isNotFilter
                ? componentName.slice(1)
                : componentName;

            if (isNotFilter) {
                // If it's a 'not' filter (prefixed with '!'), the entity should NOT have the component
                if (entity[actualComponentName]) {
                    return false;
                }
            } else {
                // If it's a regular filter, the entity MUST have the component
                if (!entity[actualComponentName]) {
                    return false;
                }
            }
        }
        return true;
    });

    // Remove each matched entity
    for (const entity of entitiesToRemove) {
        removeEntity(world, entity, false); // remove immediately
    }
}



/**
 * Get entities from the world with all provided components. Optionally,
 * @param {World} world 
 * @param {string[]} componentNames A component filter used to match entities. 
 * Must match all of the components in the filter.
 * Can add an exclamation mark at the beginning to query by components that are not present. For example:
 * `const entities = ECS.getEntities(world, [ 'transform', '!hero' ])`
 * 
 * @param {ListenerType} [listenerType] Optional. Can be "added" or "removed". Provides a list of entities
 * that match were "added" or "removed" since the last system call which matched the filter.
 * * @param {ListenerResult} [listenerEntities] Optional. Provides the resulting entities that match the added/removed event.
 * must be present whenever ListenerType is present.
 * @returns {Entity[]} an array of entities that match the given filters
 */
export function getEntities (world, componentNames, listenerType, listenerEntities) {
    const filterId = componentNames.join(',')

    if (!world.filters[filterId])
        world.filters[filterId] = world.entities.filter((e) => _matchesFilter(filterId, e))

    // accumulate stats for the in-progress frame. cleanup() publishes them.
    const stats = world.stats
    stats._filterInvocationCount[filterId] = (stats._filterInvocationCount[filterId] || 0) + 1

    const systemStats = stats.systems[stats.currentSystem]
    if (systemStats)
        systemStats._filters[filterId] = (systemStats._filters[filterId] || 0) + world.filters[filterId].length

    if (listenerType === 'added' || listenerType === 'removed') {

        if (listenerEntities) {
            listenerEntities.count = 0
            for (const entity of world.listeners[listenerType]) {
                if (_matchesFilter(filterId, entity)) {
                    listenerEntities.entries[listenerEntities.count] = entity
                    listenerEntities.count++
                }
            }

            return listenerEntities
        }

    } else if (listenerType) {
        throw new Error(`Invalid listenerType '${listenerType}'. Should be 'removed' or 'added'.`)
    }

    return world.filters[filterId]
}


/**
 * Get one entity from the world with all provided components. Optionally,
 * @param {World} world 
 * @param {string[]} componentNames A component filter used to match entities. 
 * Must match all of the components in the filter.
 * Can add an exclamation mark at the beginning to query by components that are not present. For example:
 * `const e = ECS.getEntity(world, [ 'transform', '!hero' ])`
 * 
 * @returns {Entity|void} one entity that matches the given filters or undefined if none match
 */
export function getEntity (world, componentNames) {
    return getEntities(world, componentNames)[0]
}


/**
 * returns true if an entity contains all the components that match the filter
 * all entities having at least one component in the ignore list are excluded.
 * @param {string} filterId 
 * @param {Entity} entity 
 * @param {string[]} componentIgnoreList 
 * @returns 
 */
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

/**
 * Adds a system to the world.
 * @param {World} world 
 * @param {SystemFunction} fn 
 */
export function addSystem (world, fn) {
    const system = fn(world)

    world.stats.systems.push({
        name: fn.name || 'anonymousSystem',
        timeElapsed: 0, // milliseconds spent in this system during the last completed frame
        // key is filterId, value is number of entities that matched the filter
        filters: { },
        _timeElapsed: 0, // in-progress frame accumulators, published by cleanup()
        _filters: { },
    })

    if (!system.onPreFixedUpdate)
        system.onPreFixedUpdate = function () { }

    if (!system.onFixedUpdate)
        system.onFixedUpdate = function () { }

    if (!system.onPostFixedUpdate)
        system.onPostFixedUpdate = function () { }

    if (!system.onPreUpdate)
        system.onPreUpdate = function () { }

    if (!system.onUpdate)
        system.onUpdate = function () { }

    if (!system.onPostUpdate)
        system.onPostUpdate = function () { }

    world.systems.push(system)
}

/**
 * 
 * @param {World} world 
 * @param {number} dt Change in time since last update, in milliseconds
 */
export function preFixedUpdate (world, dt) {
    for (let i=0; i < world.systems.length; i++) {
        world.stats.currentSystem = i
        const system = world.systems[i]
        const start = performance.now()
        system.onPreFixedUpdate(dt)
        world.stats.systems[i]._timeElapsed += (performance.now() - start)
    }
}


/**
 * 
 * @param {World} world 
 * @param {number} dt Change in time since last update, in milliseconds
 */
export function fixedUpdate (world, dt) {
    for (let i=0; i < world.systems.length; i++) {
        world.stats.currentSystem = i
        const system = world.systems[i]
        const start = performance.now()
        system.onFixedUpdate(dt)
        world.stats.systems[i]._timeElapsed += (performance.now() - start)
    }
}

/**
 * 
 * @param {World} world 
 * @param {number} dt Change in time since last update, in milliseconds
 */
export function postFixedUpdate (world, dt) {
    for (let i=0; i < world.systems.length; i++) {
        world.stats.currentSystem = i
        const system = world.systems[i]
        const start = performance.now()
        system.onPostFixedUpdate(dt)
        world.stats.systems[i]._timeElapsed += (performance.now() - start)
    }
}


/**
 * 
 * @param {World} world 
 * @param {number} dt Change in time since last update, in milliseconds
 */
export function preUpdate (world, dt) {
    for (let i=0; i < world.systems.length; i++) {
        world.stats.currentSystem = i
        const system = world.systems[i]
        const start = performance.now()
        system.onPreUpdate(dt)
        world.stats.systems[i]._timeElapsed += (performance.now() - start)
    }
}

/**
 * 
 * @param {World} world 
 * @param {number} dt Change in time since last update, in milliseconds
 */
export function update (world, dt) {
    for (let i=0; i < world.systems.length; i++) {
        world.stats.currentSystem = i
        const system = world.systems[i]
        const start = performance.now()
        system.onUpdate(dt)
        world.stats.systems[i]._timeElapsed += (performance.now() - start)
    }
}

/**
 * 
 * @param {World} world 
 * @param {number} dt Change in time since last update, in milliseconds
 */
export function postUpdate (world, dt) {
    for (let i=0; i < world.systems.length; i++) {
        world.stats.currentSystem = i
        const system = world.systems[i]
        const start = performance.now()
        system.onPostUpdate(dt)
        world.stats.systems[i]._timeElapsed += (performance.now() - start)
    }
}

/**
 * publish the in-progress frame's stats into the public fields, and reset the accumulators
 * for the next frame. Values are copied into the existing objects, so references stay valid.
 * @param {World} world 
 */
function _publishStats (world) {
    const stats = world.stats

    for (const filterId in stats._filterInvocationCount) {
        stats.filterInvocationCount[filterId] = stats._filterInvocationCount[filterId]
        stats._filterInvocationCount[filterId] = 0
    }

    for (const system of stats.systems) {
        system.timeElapsed = system._timeElapsed
        system._timeElapsed = 0

        for (const filterId in system._filters) {
            system.filters[filterId] = system._filters[filterId]
            system._filters[filterId] = 0
        }
    }

    stats.currentSystem = 0
}

/**
 * 
 * @param {World} world 
 * @param {Entity} entity 
 * @param {string} componentName 
 */
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
        } else if (_hasComponent(filterId, componentName)) {
            // entity doesn't match filter and it's in the filter remove it
            // this filter contains the removed component
            const filterIdx = filter.indexOf(entity)
            if (filterIdx >= 0)
                removeItems(filter, filterIdx, 1)
        }
    }
}

/**
 * 
 * @param {World} world 
 * @param {Entity} entity 
 */
function _removeEntity (world, entity) {
    for (const componentName in entity)
        if (entity[componentName])
            world.stats.componentCount[componentName] -= 1

    const entityToRemoveIdx = world.entities.indexOf(entity)

    const entityId = world.entityIds.get(entity)
    if (entityId !== undefined) {
        world.entityIds.delete(entity)
        world.entityIds.delete(entityId)
    }

    removeItems(world.entities, entityToRemoveIdx, 1)

    // if this entity was defer removed, but then insta-removed, we can remove
    // this entity from the deferred removal list. e.g.,
    //
    // ECS.removeEntity(w, e, true)  // deferred removal
    // ECS.removeEntity(w, e, false) // instant removal
    //   <-- at this point, there shouldnt be anything in the deferred removal list for the cleanup step to run
    // ECS.cleanup()
    world.deferredRemovals.entities.delete(entity)

    for (let i=world.deferredRemovals.components.length-1; i >= 0; i--) {
        const [ e ] = world.deferredRemovals.components[i]
        if (e === entity) {
            // remove this component from the deferred list since the entity it belongs to has already been removed
            removeItems(world.deferredRemovals.components, i, 1)
        }
    }

    // update all filters that match this
    for (const filterId in world.filters) {
        const filter = world.filters[filterId]
        const idx = filter.indexOf(entity)
        if (idx >= 0)
            removeItems(filter, idx, 1)
    }
}

/**
 * purpose: by given filterId and component determine if component is referred in that filter.
 * @param {string} filterId a string in the form "component1,component2,...,componentN", component is a string
 * @param {string} component 
 * @returns {boolean}
 */
function _hasComponent (filterId, component) {
  return (filterId === component) ||
         filterId.startsWith(`${component},`) ||
         filterId.endsWith(`,${component}`) ||
         filterId.includes(`,${component},`)
}

/**
 * necessary cleanup step at the end of each frame loop. Processes deferred removals, rotates
 * added/removed listeners, and publishes this frame's stats to `world.stats`.
 * @param {World} world 
 */
export function cleanup (world) {

    // move all of the entities that were added/removed this frame into the list to report
    // next frame. This ensures that events aren't missed when systems add entities after another
    // system listening for those entities has already run this frame.
    world.listeners.added.clear()
    world.listeners.removed.clear()

    for (const e of world.listeners._added)
        world.listeners.added.add(e)

    for (const e of world.listeners._removed)
        world.listeners.removed.add(e)

    world.listeners._added.clear()
    world.listeners._removed.clear()


    // process all entity components marked for deferred removal
    for (let i=0; i < world.deferredRemovals.components.length; i++) {
        const [ entity, componentName ] = world.deferredRemovals.components[i]
        _removeComponent(world, entity, componentName)
    }

    world.deferredRemovals.components.length = 0

    // process all entities marked for deferred removal
    for (const entity of world.deferredRemovals.entities)
        _removeEntity(world, entity)

    world.deferredRemovals.entities.clear()

    // this frame is complete. make its stats readable until the next cleanup()
    _publishStats(world)
}


export default {
    createWorld,
    createEntity,

    getEntityId,
    getEntityById,

    addComponentToEntity,
    removeComponentFromEntity,
    getEntities,
    getEntity,
    removeEntity,
    removeEntities,
    addSystem,
    preFixedUpdate,
    fixedUpdate,
    postFixedUpdate,
    update,
    preUpdate,
    postUpdate,
    cleanup,

    // aliases. shorter == nicer :)
    addWorld: createWorld,
    addEntity: createEntity,
    addComponent: addComponentToEntity,
    removeComponent: removeComponentFromEntity
}
