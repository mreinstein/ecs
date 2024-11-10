#0.23.0
* add `removeEntities` function (thank you @chriscoderdr !)


# 0.22.0
* Use `performance.now()` everywhere instead of falling back to `Date.now()`
* make API simpler and more consistent:
    * alias addWorld -> createWorld
	* alias addEntity -> createEntity
	* alias addComponent -> addComponentToEntity
	* alias removeComponent -> removeComponentFromEntity


# 0.21.0
* refactor `deferredRemovals` to not rely on entity indexes


# 0.20.0
* add `getEntityById(world, id)` and `getEntityId(world, entity)` functions


# 0.19.0
* add an `getEntity(world, components)` function for a bit of syntax sugar


# 0.18.4
* [`180ff077d7e`]](https://github.com/mreinstein/ecs/commit/180ff077d7e1c966ede47204ef69113c2102dbf3) fix some really terrible crashing bugs 
* add unit tests to cover all of those discovered cases


# 0.18.3
* oof, revert serious breakage from 0.18.2 :'(


# 0.18.2
* remove one function wrapper in the hot path


# 0.18.1
* fix bug where doing an immediate removal after a deferred removal breaks cleanup


# 0.18.0
* BREAKING: `added` and `removed` entities have a new API structure, where an additional argument is required
* internally the `listeners` property uses Set instead of Object


# 0.17.0
* BREAKING: `added` and `removed` entities are now delayed until after `ECS.cleanup()` runs to avoid missing entities based on system order. Fixes #35
* BREAKING: passing an invalid `listenerType` (e.g., `ECS.getEntities(w, [], 'blahblah')`) now throws an error
* avoid `Array.splice()` because it generates memory garbage
* replace rollup with esbuild in the chrome extension bundling step


# 0.16.0
* add Typescript types, jsdoc, and named exports


# 0.15.0
* add option to remove entity's immediately rather than being deferred to the next frame


# 0.14.0
* add preFixedUpdate
* add postFixedUpdate


# 0.13.1
* update deps


# 0.13.0
Thanks to @pavelvasev for both of these bug fixes!

* fix add component bug #22 
* fix add component listener bug #19


# 0.12.0
* add option to remove entity's component immediately rather than being deferred to the next frame


# 0.11.0
* BREAKING: publish as a pure ES module
* add a chrome devtools extension to show realtime ECS stats


# 0.10.1
* use a more distinct separator string


# 0.10.0
* bugfix: handle duplicate entity removes
* bugfix: handle duplicate component adds and removes
* chore: update tap dep
* chore: include node 14 in travis ci builds


# 0.9.1
* fix not filter querying #12


# 0.9.0
* implement a not filter for components


# 0.8.0
* implement deferred removal of entities and components
* rename `emptyListeners` function to `cleanup`


# 0.7.0
* add a 3rd parameter to getEntities to enable querying for added and removed entities that match the filter


# 0.6.1
* improve readme
* add more tests


# 0.6.0
* added `onPreUpdate` and `onPostUpdate` system lifecycle functions


# 0.5.1
* set default component data when none provided


# 0.5.0
* implement removeComponentFromEntity


# 0.4.0
* total API do-over
* initial unit tests
