import ECS from '../ecs.js'
import tap from 'tap'


const w = ECS.createWorld()

const e = ECS.createEntity(w)

ECS.addComponentToEntity(w, e, 'a')
ECS.addComponentToEntity(w, e, 'b')
ECS.addComponentToEntity(w, e, 'c')

let r = ECS.getEntities(w, [ 'a', 'b', 'c' ], 'added')
let r2 = ECS.getEntities(w, [ 'c' ], 'added')

tap.same(r, [ e ], 'setting up an added listener includes entities already matching the filter')
tap.same(r2, [ e ], 'setting up an added listener includes entities already matching the filter')
tap.same(w.listeners.added, { "a,b,c": [ e ], "c": [ e ] }, 'clearing listeners should empty out the lists')


ECS.cleanup(w)


tap.same(w.listeners.added, { 'a,b,c': [ ], 'c': [ ] }, 'emptying listeners should empty out the lists')


tap.same(w.listeners.removed, { }, 'removed lists are empty when no queries are made')


r = ECS.getEntities(w, [ 'a', 'b', 'c' ], 'removed')
r2 = ECS.getEntities(w, [ 'c' ], 'removed')

ECS.removeComponentFromEntity(w, e, 'c')

tap.same(w.listeners.removed, { "a,b,c": [ e ], "c": [ e ] }, 'removing component should add to removed lists')


testRemoveEntity()


function testRemoveEntity () {
    const w = ECS.createWorld()

    const e = ECS.createEntity(w) 

    ECS.addComponentToEntity(w, e, 'a')

    const r = ECS.getEntities(w, [ 'a' ], 'removed')
    tap.same(r, [ ])

    ECS.removeEntity(w, e)
    const r2 = ECS.getEntities(w, [ 'a' ], 'removed')
    tap.same(r2, [ e ], 'removing entity should add it to removed listeners')
}



function testRemoveComponentWithoutDeferred () {
    const w = ECS.createWorld()

    // setup the remove listener
    let r = ECS.getEntities(w, [ 'a' ], 'removed')

    const e = ECS.createEntity(w) 

    ECS.addComponentToEntity(w, e, 'a')
    ECS.addComponentToEntity(w, e, 'b')


    const deferredRemoval = false
    ECS.removeComponentFromEntity(w, e, 'a', deferredRemoval)
  
    r = ECS.getEntities(w, [ 'a' ], 'removed')

    tap.same(r, [ e ], 'immediately removing a component still includes it in the removed list')

    console.error('W:', w)
    console.error('R:', r)
}


testRemoveComponentWithoutDeferred()
