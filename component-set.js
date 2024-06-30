import removeItems from 'remove-array-items'


/**
 * Track an entity, component tuple as a unique key in a set.
 */

export function create () {
	return [ ]
}


export function includes (set, entity, componentName) {
   for (const entry of set) {
        if (entry[0] === entity && entry[1] === componentName) {
            return true
        }
   }
   
   return false
}


export function add (set, entity, componentName) {
    set.push([ entity, componentName ])
}


export function remove (set, entity, componentName) {
    for (let i=set.length-1; i >= 0; i--) {
        const entry = set[i]
        if (entry[0] === entity && entry[1] === componentName) {
            removeItems(set, i, 1)
            return
        }
    }
}

