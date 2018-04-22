/**
 * Returns value of capture given a pattern and text, by default returns first capture (zero-indexed)
 */
export const extract = (text: string, pattern: RegExp, index: number = 0): string => {
    if (!pattern.test(text))
        return null

    const results = pattern.exec(text).slice(1)

    if (index > results.length - 1)
        return null

    return results[index]
}

/**
 * Returns capture of first item in collection that matches the pattern
 * @param collection Array of strings to test
 * @param pattern Regex pattern to test on collection
 * @param index Zero-based index of capture to return, default is 0
 */
export const extractFirst = (collection: string[], pattern: RegExp, index: number = 0) => {
    for (const item of collection) {
        const result = extract(item, pattern, index)
        if (result != null) return result
    }

    return null
}
