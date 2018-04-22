export const omit = <T extends object>(obj: T, key: keyof T) => {
    const copy = { ...obj as any }
    delete copy[key]
    return copy
}
