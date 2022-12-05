
/**
 * insert the new item such that the array stays ordered from highest to lowest
 * @param {number[]} arr array of numbers to be mutated
 * @param {number} val value to insert
 * @returns {void} arr is mutated
 */
export default function orderedInsert (arr, val) {
    for (let i=0; i < arr.length; i++) {
        if (arr[i] <= val) {

            // shift down all of the entries after the insert location by 1
            for (let idx=arr.length-1; idx >= i; idx--)
                arr[idx+1] = arr[idx]

            arr[i] = val

            return
        }
    }

    arr.push(val)
}
