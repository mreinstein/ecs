import * as ComponentSet from '../component-set.js'
import { test }          from 'node:test'
import assert            from 'node:assert/strict'


test('component set add/remove/includes', function () {
    const s = ComponentSet.create()

    const a = { }
    //const b = { }

    ComponentSet.add(s, a, 'comp-1')
    //ComponentSet.add(s, a, 'comp-2')
    //ComponentSet.add(s, b, 'comp-1')

    assert.equal(ComponentSet.includes(s, a, 'comp-1'), true)

    ComponentSet.remove(s, a, 'comp-1')
    assert.equal(ComponentSet.includes(s, a, 'comp-1'), false)
})
