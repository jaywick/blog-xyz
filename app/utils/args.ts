import { extractFirst } from './regex'

export const getArgs = (key: string, defaultValue: string) => {
    const pattern = new RegExp(`--${key} (.+)($| )`)
    return extractFirst(process.argv, pattern) || defaultValue
}
