import orderedInsert from './ordered-insert.js'
import removeItems   from 'remove-array-items'


function createWorld () {
    return {
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
        }
    }
}


function createEntity (world) {
    const entity = { }
    world.entities.push(entity)
    return entity
}


function addComponentToEntity (world, entity, componentName, componentData={}) {
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
        if (matches && list.indexOf(entity) < 0)
            list.push(entity)
    }
}


function removeComponentFromEntity (world, entity, componentName) {
    
    //  get list of all remove listeners that we match
    const matchingRemoveListeners = [ ]
    for (const filterId in world.listeners.removed) {
        // if an entity matches a remove filter, but then no longer matches the filter after a component
        // is removed, it should be flagged as removed in listeners.removed
        if (_matchesFilter(filterId, entity) && !_matchesFilter(filterId, entity, [ componentName ]))
            world.listeners.removed[filterId].push(entity)
    }

    // add this component to the list of deferred removals
    const idx = world.entities.indexOf(entity)
    world.removals.components.push(idx, componentName)
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
        if (matches && list.indexOf(entity) < 0) {
            list.push(entity)
        }
    }

    // add this entity to the list of deferred removals
    orderedInsert(world.removals.entities, idx)
}


function getEntities (world, componentNames, listenerType) {
    const filterId = componentNames.join(',')
    if (!world.filters[filterId])
        world.filters[filterId] = world.entities.filter((e) => _matchesFilter(filterId, e))

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
        const isIgnored = componentIgnoreList.indexOf(componentId) >= 0
        if (isIgnored)
            return false

        if (!entity[componentId])
            return false
    }

    return true
}


function addSystem (world, fn) {
    const system = fn(world)

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
    for (const system of world.systems)
        system.onFixedUpdate(dt)
}


function preUpdate (world, dt) {
    for (const system of world.systems)
        system.onPreUpdate(dt)
}


function update (world, dt) {
    for (const system of world.systems)
        system.onUpdate(dt)
}


function postUpdate (world, dt) {
    for (const system of world.systems)
        system.onPostUpdate(dt)
}


// remove all entities that were added/removed this frame from the listener set
// should be called after postUpdate
function emptyListeners (world) {
    for (const filterId in world.listeners.added)
        world.listeners.added[filterId].length = 0

    for (const filterId in world.listeners.removed)
        world.listeners.removed[filterId].length = 0
}


function cleanup (world) {
    emptyListeners(world)

    // process all entity components marked for deferred removal
    for (let i=0; i < world.removals.components.length; i+=2) {
        const entityIdx = world.removals.components[i];
        const componentName = world.removals.components[i+1]

        const entity = world.entities[entityIdx]
        delete entity[componentName]

        // remove this entity from any filters that no longer match
        for (const filterId in world.filters) {
            if (filterId.indexOf(componentName) >= 0) {
                // this filter contains the removed component
                const filter = world.filters[filterId]
                const filterIdx = filter.indexOf(entity)
                if (filterIdx >= 0)
                    removeItems(filter, filterIdx, 1)
            }
        }
    }

    world.removals.components.length = 0


    // process all entities marked for deferred removal
    for (const entityIdx of world.removals.entities) {
        const entity = world.entities[entityIdx]

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
}


export default { createWorld, createEntity, addComponentToEntity, removeComponentFromEntity, getEntities,
                 removeEntity, addSystem, fixedUpdate, update, preUpdate, postUpdate, cleanup }
