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
 * @typedef { Object } Listener
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
 * @typedef { Object } WorldStats
 * @prop {number} entityCount
 * @prop {{ [ key: number ]: number }} componentCount key is component id, value is instance count
 * @prop {{ [ key: number ]: number }} filterInvocationCount key is filter id, value is number of times this filter was run this frame
 * @prop {{
 *   name: string;
 *   timeElapsed: number;
 *   filters: {
 *     [ key: string ]: number;
 *   };
 * }[]} systems
 * @prop {number} currentSystem the array index of the currently processed system
 *   used to determine which systems invoke queries
 * @prop {number} lastSendTime time stats were last sent (used to throttle send)
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
 * Creates a world and sends window post message with id `mreinstein/ecs-source`
 * and method `worldCreated`
 *
 * @param {number} worldId ID of the world to create
 * @returns {World} created world
 */
export function createWorld(worldId?: number): World;
/**
 * Creates an entity and adds it to the world, incrementing the entity count
 * @param {World} world world where entity will be added
 * @returns {Entity} the created entity
 */
export function createEntity(world: World): Entity;
export function getEntityId(world: any, entity: any): any;
export function getEntityById(world: any, entityId: any): any;
/**
 * Adds a component to the entity
 * @param {World} world world where listener will be invoked
 * @param {Entity} entity
 * @param {string} componentName
 * @param {Component} [componentData]
 * @returns {void} returns early if this is a duplicate componentName
 */
export function addComponentToEntity(world: World, entity: Entity, componentName: string, componentData?: Component): void;
/**
 * Removes a component from the entity, optionally deferring removal
 * @param {World} world world where listener will be invoked
 * @param {Entity} entity entity to remove component from
 * @param {string} componentName name of the component to remove
 * @param {boolean} [deferredRemoval] Default is true, optionally defer removal
 * @returns {void} returns early if componentName does not exist on entity
 */
export function removeComponentFromEntity(world: World, entity: Entity, componentName: string, deferredRemoval?: boolean): void;
/**
 * Remove an entity from the world
 * @param {World} world world to remove entity from and emit listeners
 * @param {Entity} entity entity to remove
 * @param {boolean} [deferredRemoval] Default is true, optionally defer removal
 * @returns {void} returns early if entity does not exist in world
 */
export function removeEntity(world: World, entity: Entity, deferredRemoval?: boolean): void;
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
export function getEntities(world: World, componentNames: string[], listenerType?: ListenerType, listenerEntities?: ListenerResult): Entity[];
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
export function getEntity(world: World, componentNames: string[]): Entity | void;
/**
 * Adds a system to the world.
 * @param {World} world
 * @param {SystemFunction} fn
 */
export function addSystem(world: World, fn: SystemFunction): void;
/**
 *
 * @param {World} world
 * @param {number} dt Change in time since last update, in milliseconds
 */
export function preFixedUpdate(world: World, dt: number): void;
/**
 *
 * @param {World} world
 * @param {number} dt Change in time since last update, in milliseconds
 */
export function fixedUpdate(world: World, dt: number): void;
/**
 *
 * @param {World} world
 * @param {number} dt Change in time since last update, in milliseconds
 */
export function postFixedUpdate(world: World, dt: number): void;
/**
 *
 * @param {World} world
 * @param {number} dt Change in time since last update, in milliseconds
 */
export function preUpdate(world: World, dt: number): void;
/**
 *
 * @param {World} world
 * @param {number} dt Change in time since last update, in milliseconds
 */
export function update(world: World, dt: number): void;
/**
 *
 * @param {World} world
 * @param {number} dt Change in time since last update, in milliseconds
 */
export function postUpdate(world: World, dt: number): void;
/**
 * necessary cleanup step at the end of each frame loop
 * @param {World} world
 */
export function cleanup(world: World): void;
declare namespace _default {
    export { createWorld };
    export { createEntity };
    export { getEntityId };
    export { getEntityById };
    export { addComponentToEntity };
    export { removeComponentFromEntity };
    export { getEntities };
    export { getEntity };
    export { removeEntity };
    export { addSystem };
    export { preFixedUpdate };
    export { fixedUpdate };
    export { postFixedUpdate };
    export { update };
    export { preUpdate };
    export { postUpdate };
    export { cleanup };
}
export default _default;
export type ListenerType = "added" | "removed";
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
export type WorldStats = {
    entityCount: number;
    /**
     * key is component id, value is instance count
     */
    componentCount: {
        [key: number]: number;
    };
    /**
     * key is filter id, value is number of times this filter was run this frame
     */
    filterInvocationCount: {
        [key: number]: number;
    };
    systems: {
        name: string;
        timeElapsed: number;
        filters: {
            [key: string]: number;
        };
    }[];
    /**
     * the array index of the currently processed system
     * used to determine which systems invoke queries
     */
    currentSystem: number;
    /**
     * time stats were last sent (used to throttle send)
     */
    lastSendTime: number;
};
export type World = {
    entities: Entity[];
    filters: FilterMap;
    systems: System[];
    listeners: ListenerChangeMap;
    deferredRemovals: DeferredRemovalMap;
    stats: WorldStats;
};
//# sourceMappingURL=ecs.d.ts.map