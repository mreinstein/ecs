import removeItems from 'remove-array-items'


function createWorld () {
	return {
		entities: [ ],
		filters: { },
		systems: [ ]
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
}


function removeComponentFromEntity (world, entity, componentName) {
	
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


function getEntities (world, componentNames) {
	const filterId = componentNames.join(',')
	if (!world.filters[filterId])
		world.filters[filterId] = world.entities.filter((e) => _matchesFilter(filterId, e))

	return world.filters[filterId]
}


// returns true if an entity contains all the components that match the filter
function _matchesFilter (filterId, entity) {
	const componentIds = filterId.split(',')
	// if the entity lacks any components in the filter, it's not in the filter
	for (const componentId of componentIds)
		if (!entity[componentId])
			return false

	return true
}


function removeEntity (world, entity) {
	const idx = world.entities.indexOf(entity)
	if (idx < 0)
		return

	removeItems(world.entities, idx, 1)

	// update all filters that match this
	for (const filterId in world.filters) {
		const filter = world.filters[filterId]
		const idx = filter.indexOf(entity)
		if (idx >= 0)
			removeItems(filter, idx, 1)
	}
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


export default { createWorld, createEntity, addComponentToEntity, removeComponentFromEntity, getEntities, removeEntity, addSystem, fixedUpdate, update, preUpdate, postUpdate }
