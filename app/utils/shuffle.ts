/**
 * Returns a random item in the array
 * @param array 
 */
export const shuffle = <T>(array: T[]) =>
    array && array.length && array[Math.floor(Math.random() * array.length)]
