import orderedInsert from '../ordered-insert.js'
import tap            from 'tap'


function randomInt (min, max) {
    const d = max - min
    return min + Math.floor(d * Math.random())
}


const a = [ ]


for (let i=0; i < 10; i++) {
    const val = randomInt(1, 100)
    orderedInsert(a, val)
}


let last = a[0]
for (let i=1; i < a.length; i++) {
    tap.ok(last >= a[i], 'sorts highest to lowest')
    last = a[i]
}
