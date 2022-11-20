import * as allECS from '../ecs.js'
import tap from 'tap'

tap.ok(allECS.createWorld);
tap.ok(allECS.createEntity);
tap.ok(allECS.addComponentToEntity);
tap.ok(allECS.removeComponentFromEntity);
tap.ok(allECS.removeEntity);
tap.ok(allECS.getEntities);

tap.notOk(allECS._matchesFilter);

tap.ok(allECS.addSystem);
tap.ok(allECS.preFixedUpdate);
tap.ok(allECS.fixedUpdate);
tap.ok(allECS.postFixedUpdate);
tap.ok(allECS.preUpdate);
tap.ok(allECS.update);
tap.ok(allECS.postUpdate);

tap.notOk(allECS.emptyListeners);
tap.notOk(allECS._resetStats);
tap.notOk(allECS._removeComponent);
tap.notOk(allECS._removeEntity);
tap.notOk(allECS._hasComponent);

tap.ok(allECS.cleanup);
tap.ok(allECS.default);

tap.ok(allECS.default.createWorld);
tap.ok(allECS.default.createEntity);
tap.ok(allECS.default.addComponentToEntity);
tap.ok(allECS.default.removeComponentFromEntity);
tap.ok(allECS.default.removeEntity);
tap.ok(allECS.default.getEntities);
tap.ok(allECS.default.addSystem);
tap.ok(allECS.default.preFixedUpdate);
tap.ok(allECS.default.fixedUpdate);
tap.ok(allECS.default.postFixedUpdate);
tap.ok(allECS.default.preUpdate);
tap.ok(allECS.default.update);
tap.ok(allECS.default.postUpdate);
tap.notOk(allECS.default.emptyListeners);
