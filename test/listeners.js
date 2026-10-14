import ECS from '../ecs.js'
import { test } from 'node:test'
import assert from 'node:assert/strict'


test('added listeners', function () {
    const w = ECS.addWorld()

    const e = ECS.addEntity(w)

    ECS.addComponent(w, e, 'a')
    ECS.addComponent(w, e, 'b')
    ECS.addComponent(w, e, 'c')

    const s = new Set()
    s.add(e)
    assert.deepEqual(w.listeners._added, s, 'the new entity is in the "added this frame" set')
    assert.deepEqual(w.listeners.added, new Set(), 'the new entity is NOT in the "added last frame" set')

    ECS.cleanup(w)

    assert.deepEqual(w.listeners.added, s, 'the entity is now in the "added last frame" set')
    assert.deepEqual(w.listeners._added, new Set(), 'the "added this frame" set is now empty')
})


test('removed listeners (deferred removal)', function () {
    const w = ECS.addWorld()

    const e = ECS.addEntity(w) 

    ECS.cleanup(w)

    ECS.removeEntity(w, e)

    const s = new Set()
    s.add(e)
    assert.deepEqual(w.listeners._removed, s, 'the new entity is in the "removed this frame" set')
    assert.deepEqual(w.listeners.removed, new Set(), 'the new entity is NOT in the "removed last frame" set')

    ECS.cleanup(w)
    
    assert.deepEqual(w.listeners.removed, s, 'the entity is now in the "removed last frame" set')
    assert.deepEqual(w.listeners._removed, new Set(), 'the "removed this frame" set is now empty')
})


test('removed listeners (immediate removal)', function () {
    const w = ECS.addWorld()

    const e = ECS.addEntity(w)

    ECS.cleanup(w)

    const deferredRemoval = false
    ECS.removeEntity(w, e, deferredRemoval)

    const s = new Set()
    s.add(e)
    assert.deepEqual(w.listeners._removed, s, 'the non-deferred, removed entity is in the "removed this frame" set')
    assert.deepEqual(w.listeners.removed, new Set(), 'the non-deferred, removed entity is NOT in the "removed this last frame" set')

    ECS.cleanup(w)

    assert.deepEqual(w.listeners.removed, s, 'the entity is now in the "removed last frame" set')
    assert.deepEqual(w.listeners._removed, new Set(), 'the "removed this frame" set is now empty')
})
