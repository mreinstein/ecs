import * as allECS from '../ecs.js'
import { test } from 'node:test'
import assert from 'node:assert/strict'


test('named exports', function () {
    assert.ok(allECS.createWorld);
    assert.ok(allECS.createEntity);
    assert.ok(allECS.addComponentToEntity);
    assert.ok(allECS.removeComponentFromEntity);
    assert.ok(allECS.removeEntity);
    assert.ok(allECS.getEntities);

    assert.ok(!allECS._matchesFilter);

    assert.ok(allECS.addSystem);
    assert.ok(allECS.preFixedUpdate);
    assert.ok(allECS.fixedUpdate);
    assert.ok(allECS.postFixedUpdate);
    assert.ok(allECS.preUpdate);
    assert.ok(allECS.update);
    assert.ok(allECS.postUpdate);

    assert.ok(!allECS.emptyListeners);
    assert.ok(!allECS._publishStats);
    assert.ok(!allECS._removeComponent);
    assert.ok(!allECS._removeEntity);
    assert.ok(!allECS._hasComponent);

    assert.ok(allECS.cleanup);
    assert.ok(allECS.default);
})


test('default export', function () {
    assert.ok(allECS.default.createWorld);
    assert.ok(allECS.default.createEntity);
    assert.ok(allECS.default.addComponentToEntity);
    assert.ok(allECS.default.removeComponentFromEntity);
    assert.ok(allECS.default.removeEntity);
    assert.ok(allECS.default.getEntities);
    assert.ok(allECS.default.addSystem);
    assert.ok(allECS.default.preFixedUpdate);
    assert.ok(allECS.default.fixedUpdate);
    assert.ok(allECS.default.postFixedUpdate);
    assert.ok(allECS.default.preUpdate);
    assert.ok(allECS.default.update);
    assert.ok(allECS.default.postUpdate);
    assert.ok(!allECS.default.emptyListeners);

    // aliased functions
    assert.ok(allECS.default.addWorld);
    assert.ok(allECS.default.addEntity);
    assert.ok(allECS.default.addComponent);
    assert.ok(allECS.default.removeComponent);
})
