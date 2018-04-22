import { parseDate, formatDate } from './date'

describe('date util', () => {
    it('should parse YYYY-MM-DD string', () => {
        const result = parseDate('1999-12-31')
        expect(result.getFullYear()).toBe(1999)
        expect(result.getMonth()).toBe(12 - 1) // -1 because month is zero indexed
        expect(result.getDate()).toBe(31)
        expect(result.getHours()).toBe(0)
        expect(result.getMinutes()).toBe(0)
        expect(result.getSeconds()).toBe(0)
        expect(result.getMilliseconds()).toBe(0)
    })

    it('should format 31/12/1999 to YYYY-MM-DD', () => {
        const localDate = new Date(Date.parse('Fri Dec 31 1999 11:00:00 GMT+1100 (AUS Eastern Daylight Time)'))
        const result = formatDate(localDate)
        expect(result).toBe('1999-12-31')
    })

    it('should parse null string to null', () => {
        const result = parseDate(null)
        expect(result).toBe(null)
    })

    it('should format null date to empty string', () => {
        const result = formatDate(null)
        expect(result).toBe('')
    })

    it('should parse invalid string to null', () => {
        expect(parseDate('2001-02-31-2')).toBe(null)
        expect(parseDate('2001')).toBe(null)
        expect(parseDate('sdfsdf')).toBe(null)
        expect(parseDate('345346356456456')).toBe(null)
        expect(parseDate('2001-01-200')).toBe(null)
        expect(parseDate('2001-3102')).toBe(null)
    })
})
