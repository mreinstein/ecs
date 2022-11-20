
/**
 * insert the new item such that the array stays ordered from highest to lowest
 * @param {number[]} arr array of numbers to be mutated
 * @param {number} val value to insert
 * @returns {void} arr is mutated
 */
export default function orderedInsert (arr, val) {
    for (let i=0; i < arr.length; i++) {
        if (arr[i] <= val) {
            arr.splice(i, 0, val)
            return
        }
    }

    arr.push(val)
}
