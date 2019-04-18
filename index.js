function uid () {
	return Math.round(Math.random() * 999999)
}


// entity: an integer
// component: a plain object
// archetype: a collection of component types
// filter: maps an archetype to an array of entities


function createWorld () {
	return {
		entities: { },
		components: { },
		componentTypes: { },
		entityComponents: { }, // key is entityId, value is array of components that belong to it
		filters: { },  // key is archetype, value is array of entities that match the archetype
		systems: { },  // key is systemid, value is the system itself
	}
}


function createEntity (world) {
	const id = uid()
	world.entities[id] = true
	world.entityComponents[id] = [ ]
	return id
}


function createComponentType (world, name, data) {
	const typeid = uid()
	world.componentTypes[typeid] = { typeid, name, data }
	return typeid
}


function addComponentToEntity (world, entityId, componentTypeId) {
	if (!world.entities[entityId])
		throw new Error(`Entity ${entityId} not found`)

	if (!world.componentTypes[componentTypeId])
		throw new Error(`Component Type ${componentTypeId} not found`)

	const existingComponent = world.entityComponents[entityId].find((c) => c.componentTypeId === componentTypeId)
	if (existingComponent)
		return

	const clonedData = JSON.parse(JSON.stringify(world.componentTypes[componentTypeId].data))
	const componentId = uid()
	world.components[componentId] = { id: componentId, entityId, componentTypeId, data: clonedData }

	world.entityComponents[entityId].push(world.components[componentId])

	// for all filters that include this component type, recalculate the entities that belong to it
	for (const archetype in world.filters) {
		const filter = world.filters[archetype]
		if (filter.uniqueComponentTypeIds[componentTypeId])
			updateFilter(world, archetype)
	}
}


function getComponents (world, entityId) {
	const result = { }
	for (const c of world.entityComponents[entityId]) {
		const componentType = world.componentTypes[c.componentTypeId]
		result[componentType.name] = c.data
	}
	return result
}


function updateFilter (world, archetype) {
	const filter = world.filters[archetype]
	filter.entities.length = 0

	// filter all existing entities and add them to this filter if they match
	for (const entityId in world.entities) {
		let matches = true
		for (const componentTypeId in filter.uniqueComponentTypeIds)
			if (!world.entityComponents[entityId].find((c) => c.componentTypeId === parseInt(componentTypeId, 10)))
				matches = false

		if (matches) {
			const result = { }
			for (const componentTypeId in filter.uniqueComponentTypeIds) {
				const name = world.componentTypes[componentTypeId].name
				result[name] = findComponent(world, entityId, componentTypeId)
			}
			world.filters[archetype].entities.push(result)
		}
	}
}


// update all filters that contain at least one of the component types provided
function updateFilters (world, componentTypesUsed) {
	// update all filters affected by this
	for (const archetype in world.filters) {
		const filter = world.filters[archetype]
		let affected = false
		for (const ctu of componentTypesUsed)
			if (filter.uniqueComponentTypeIds[ctu])
				affected = true

		if (affected)
			updateFilter(world, archetype)
	}
}


function findComponent (world, entityId, componentTypeId) {
	entityId = parseInt(entityId, 10)
	componentTypeId = parseInt(componentTypeId, 10)

	for (const c in world.components)
		if (world.components[c].entityId === entityId && world.components[c].componentTypeId === componentTypeId)
			return world.components[c]
}


function createFilter (world, components) {
	const uniqueComponentTypeIds = { }
	for (const componentTypeId of components)
		uniqueComponentTypeIds[componentTypeId] = true

	const archetype = Object.keys(uniqueComponentTypeIds)
	                        .sort((a, b) => a - b)
	                        .join(',')

	if (world.filters[archetype])
		return world.filters[archetype]

	world.filters[archetype] = {
		uniqueComponentTypeIds, // mactching componentids
		entities: [ ] // entities that pass this filter
	}

	updateFilter(world, archetype)

	return archetype
}


function getEntities (world, archetype) {
	if (!world.filters[archetype])
		throw new Error(`Archetype ${archetype} not found`)

	return world.filters[archetype].entities
}


function removeEntity (world, entityId) {
	delete world.entities[entityId]

	for (const ec of world.entityComponents[entityId])
		delete world.components[ec.id]

	const componentTypesUsed = world.entityComponents[entityId].map((ct) => ct.componentTypeId)

	world.entityComponents[entityId].length = 0
	delete world.entityComponents[entityId]

	// update all filters affected by this
	updateFilters(world, componentTypesUsed)
}


function removeComponentFromEntity (world, entityId, componentTypeId) {
	if (!world.entities[entityId])
		throw new Error(`Entity ${entityId} not found`)

	if (!world.componentTypes[componentTypeId])
		throw new Error(`Component Type ${componentTypeId} not found`)

	for (let i=0; i < world.entityComponents[entityId].length; i++) {
		const entityComponent = world.entityComponents[entityId][i]
		if (entityComponent.componentTypeId === componentTypeId) {
			delete world.components[entityComponent]
			world.entityComponents[entityId].splice(i, 1)
			break
		}
	}

	// update all filters affected by this
	const componentTypesUsed = [ componentTypeId ] //world.entityComponents[entityId].map((ct) => ct.componentTypeId)
	updateFilters(world, componentTypesUsed)
}


function addSystem (world, fn) {
	const systemId = uid()
	const system = fn(world)
	if (!system.onUpdate)
		system.onUpdate = function () { }
	world.systems[systemId] = system
	return systemId
}


function update (world) {
	for (const systemId in world.systems) {
		const system = world.systems[systemId]
		system.onUpdate(world)
	}
}

/*
function createBehavior (world, fn) {
	const behaviorId = uid()
	const behavior = fn()
	world.behaviors[behaviorId] = behavior
	return behaviorId
}


// filter which entities the following behavior operates on 
const EnemyBehaviorFilter = {
	entity: ut.Entity,
	bounds: game.Boundaries,
	speed: game.MoveSpeed,
	speedChange: game.ChangeOverTime
}


function SampleBehavior () {

	// runs whenever an entity matching the filter is enabled
	const onEntityEnable = function (entity, data) {
		//let newSpeed = data.speed.speed + (data.speedChange.changePerSecond * totalTime)
		//data.speed.speed = newSpeed
		//let randomX = data.bounds.minX
	}

	// runs whenever an entity is updated
	const onEntityUpdate = function (entity, data) {
		//this.world.addComponent(this.entity)
		//this.world.destroyEntity(this.data.entity)
	}

	return { data: EnemyBehaviorFilter, onEntityEnable, onEntityUpdate }
}
*/

export default {
	addComponentToEntity,
	addSystem,
	createWorld,
	createEntity,
	createComponentType,
	createFilter,
	getEntities,
	getComponents,
	removeEntity,
	removeComponentFromEntity,
	update
}
