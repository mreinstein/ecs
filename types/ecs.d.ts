export type ListenerType = 'added' | 'removed';
export type ListenerResult = Entity[];
export type Component = any;
export type Entity = {
    [key: string]: Component;
};
export type FilteredEntityList = Entity[];
export type SystemUpdateFunction = (dt: number) => void;
export type System = {
    onPreFixedUpdate?: SystemUpdateFunction;
    onFixedUpdate?: SystemUpdateFunction;
    onPostFixedUpdate?: SystemUpdateFunction;
    onPreUpdate?: SystemUpdateFunction;
    onUpdate?: SystemUpdateFunction;
    onPostUpdate?: SystemUpdateFunction;
};
export type SystemFunction = {
    (world: World): System;
};
export type Listener = any;
export type ListenerMap = {
    [key: string]: Listener;
};
export type ListenerChangeMap = {
    added: ListenerMap;
    removed: ListenerMap;
};
export type FilterMap = {
    [filterId: string]: FilteredEntityList;
};
export type DeferredRemovalMap = {
    entities: number[];
    /**
     * [ entity, component name ]
     */
    components: string[];
};
export type SystemStats = {
    name: string;
    /**
     * milliseconds spent in this system during the last completed frame
     */
    timeElapsed: number;
    /**
     * key is filter id, value is the number of entities
     * that matched the filter during the last completed frame
     */
    filters: {
        [filterId: string]: number;
    };
    /**
     * internal: accumulates the in-progress frame's time
     */
    _timeElapsed: number;
    /**
     * internal: accumulates the in-progress frame's filter matches
     */
    _filters: {
        [filterId: string]: number;
    };
};
export type WorldStats = {
    entityCount: number;
    /**
     * key is component id, value is instance count
     */
    componentCount: {
        [key: string]: number;
    };
    /**
     * key is filter id, value is number of
     * times this filter was run during the last completed frame
     */
    filterInvocationCount: {
        [key: string]: number;
    };
    /**
     * internal: accumulates the in-progress frame's invocations
     */
    _filterInvocationCount: {
        [key: string]: number;
    };
    systems: SystemStats[];
    /**
     * the array index of the currently processed system
     * used to determine which systems invoke queries
     */
    currentSystem: number;
};
export type World = {
    entities: Entity[];
    filters: FilterMap;
    systems: System[];
    listeners: ListenerChangeMap;
    deferredRemovals: DeferredRemovalMap;
    stats: WorldStats;
};
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
export declare function createWorld(worldId?: number): World;
/**
 * Creates an entity and adds it to the world, incrementing the entity count
 * @param {World} world world where entity will be added
 * @returns {Entity} the created entity
 */
export declare function createEntity(world: World): Entity;
export declare function getEntityId(world: any, entity: any): any;
export declare function getEntityById(world: any, entityId: any): any;
/**
 * Adds a component to the entity
 * @param {World} world world where listener will be invoked
 * @param {Entity} entity
 * @param {string} componentName
 * @param {Component} [componentData]
 * @returns {void} returns early if this is a duplicate componentName
 */
export declare function addComponentToEntity(world: World, entity: Entity, componentName: string, componentData?: Component): void;
/**
 * Removes a component from the entity, optionally deferring removal
 * @param {World} world world where listener will be invoked
 * @param {Entity} entity entity to remove component from
 * @param {string} componentName name of the component to remove
 * @param {boolean} [deferredRemoval] Default is true, optionally defer removal
 * @returns {void} returns early if componentName does not exist on entity
 */
export declare function removeComponentFromEntity(world: World, entity: Entity, componentName: string, deferredRemoval?: boolean): void;
/**
 * Remove an entity from the world
 * @param {World} world world to remove entity from and emit listeners
 * @param {Entity} entity entity to remove
 * @param {boolean} [deferredRemoval] Default is true, optionally defer removal
 * @returns {void} returns early if entity does not exist in world
 */
export declare function removeEntity(world: World, entity: Entity, deferredRemoval?: boolean): void;
/**
 * Remove entities from the world that match the given component criteria.
 * @param {World} world - The world containing the entities.
 * @param {string[]} componentNames - Array of component names to filter by.
 * Supports 'not' filters by prefixing component names with '!'.
 */
export declare function removeEntities(world: World, componentNames: string[]): void;
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
export declare function getEntities(world: World, componentNames: string[], listenerType?: ListenerType, listenerEntities?: ListenerResult): Entity[];
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
export declare function getEntity(world: World, componentNames: string[]): Entity | void;
/**
 * Adds a system to the world.
 * @param {World} world
 * @param {SystemFunction} fn
 */
export declare function addSystem(world: World, fn: SystemFunction): void;
/**
 *
 * @param {World} world
 * @param {number} dt Change in time since last update, in milliseconds
 */
export declare function preFixedUpdate(world: World, dt: number): void;
/**
 *
 * @param {World} world
 * @param {number} dt Change in time since last update, in milliseconds
 */
export declare function fixedUpdate(world: World, dt: number): void;
/**
 *
 * @param {World} world
 * @param {number} dt Change in time since last update, in milliseconds
 */
export declare function postFixedUpdate(world: World, dt: number): void;
/**
 *
 * @param {World} world
 * @param {number} dt Change in time since last update, in milliseconds
 */
export declare function preUpdate(world: World, dt: number): void;
/**
 *
 * @param {World} world
 * @param {number} dt Change in time since last update, in milliseconds
 */
export declare function update(world: World, dt: number): void;
/**
 *
 * @param {World} world
 * @param {number} dt Change in time since last update, in milliseconds
 */
export declare function postUpdate(world: World, dt: number): void;
/**
 * necessary cleanup step at the end of each frame loop. Processes deferred removals, rotates
 * added/removed listeners, and publishes this frame's stats to `world.stats`.
 * @param {World} world
 */
export declare function cleanup(world: World): void;
declare const _default: {
    createWorld: typeof createWorld;
    createEntity: typeof createEntity;
    getEntityId: typeof getEntityId;
    getEntityById: typeof getEntityById;
    addComponentToEntity: typeof addComponentToEntity;
    removeComponentFromEntity: typeof removeComponentFromEntity;
    getEntities: typeof getEntities;
    getEntity: typeof getEntity;
    removeEntity: typeof removeEntity;
    removeEntities: typeof removeEntities;
    addSystem: typeof addSystem;
    preFixedUpdate: typeof preFixedUpdate;
    fixedUpdate: typeof fixedUpdate;
    postFixedUpdate: typeof postFixedUpdate;
    update: typeof update;
    preUpdate: typeof preUpdate;
    postUpdate: typeof postUpdate;
    cleanup: typeof cleanup;
    addWorld: typeof createWorld;
    addEntity: typeof createEntity;
    addComponent: typeof addComponentToEntity;
    removeComponent: typeof removeComponentFromEntity;
};
export default _default;
//# sourceMappingURL=ecs.d.ts.map