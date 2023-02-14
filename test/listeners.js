import ECS from '../ecs.js'
import tap from 'tap'


{
    const w = ECS.createWorld()

    const e = ECS.createEntity(w)

    ECS.addComponentToEntity(w, e, 'a')
    ECS.addComponentToEntity(w, e, 'b')
    ECS.addComponentToEntity(w, e, 'c')

    const s = new Set()
    s.add(e)
    tap.same(w.listeners._added, s, 'the new entity is in the "added this frame" set')
    tap.same(w.listeners.added, new Set(), 'the new entity is NOT in the "added last frame" set')

    ECS.cleanup(w)

    tap.same(w.listeners.added, s, 'the entity is now in the "added last frame" set')
    tap.same(w.listeners._added, new Set(), 'the "added this frame" set is now empty')
}


{
    const w = ECS.createWorld()

    const e = ECS.createEntity(w) 

    ECS.cleanup(w)

    ECS.removeEntity(w, e)

    const s = new Set()
    s.add(e)
    tap.same(w.listeners._removed, s, 'the new entity is in the "removed this frame" set')
    tap.same(w.listeners.removed, new Set(), 'the new entity is NOT in the "removed last frame" set')

    ECS.cleanup(w)
    
    tap.same(w.listeners.removed, s, 'the entity is now in the "removed last frame" set')
    tap.same(w.listeners._removed, new Set(), 'the "removed this frame" set is now empty')
}


{
    const w = ECS.createWorld()

    const e = ECS.createEntity(w)

    ECS.cleanup(w)

    const deferredRemoval = false
    ECS.removeEntity(w, e, deferredRemoval)

    const s = new Set()
    s.add(e)
    tap.same(w.listeners._removed, s, 'the non-deferred, removed entity is in the "removed this frame" set')
    tap.same(w.listeners.removed, new Set(), 'the non-deferred, removed entity is NOT in the "removed this last frame" set')

    ECS.cleanup(w)

    tap.same(w.listeners.removed, s, 'the entity is now in the "removed last frame" set')
    tap.same(w.listeners._removed, new Set(), 'the "removed this frame" set is now empty')
}
