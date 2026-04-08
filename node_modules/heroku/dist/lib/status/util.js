export function getMaxUpdateTypeLength(updateTypes) {
    let max = 0;
    for (const update of updateTypes) {
        if (!max || update.length > max) {
            max = update.length;
        }
    }
    return max;
}
