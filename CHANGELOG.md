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
