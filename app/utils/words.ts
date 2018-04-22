
export const plural = (word: string, count: number, suffix = 's') =>
    word + (count === 1 ? '' : 's')
