// insert the new item such that the array stays ordered from highest to lowest
export default function orderedInsert (arr, val) {
    for (let i=0; i < arr.length; i++) {
        if (arr[i] <= val) {
            arr.splice(i, 0, val)
            return
        }
    }

    arr.push(val)
}
