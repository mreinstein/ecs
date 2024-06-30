import * as ComponentSet from '../component-set.js'
import tap               from 'tap'


{
    const s = ComponentSet.create()

    const a = { }
    //const b = { }

    ComponentSet.add(s, a, 'comp-1')
    //ComponentSet.add(s, a, 'comp-2')
    //ComponentSet.add(s, b, 'comp-1')

    tap.equal(ComponentSet.includes(s, a, 'comp-1'), true)

    ComponentSet.remove(s, a, 'comp-1')
    tap.equal(ComponentSet.includes(s, a, 'comp-1'), false)
}
