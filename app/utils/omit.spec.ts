import { omit } from './omit'

describe('omit', () => {
    it('should remove property', () => {
        const result = omit({ a: 1, b: 2, c: 3 }, 'c')
        expect(result).toMatchObject({ a: 1, b: 2 })
    })

    it('should copy object if property undefined', () => {
        const result = omit({ a: 1, b: 2, c: 3 }, 'd' as any) // force typing off
        expect(result).toMatchObject({ a: 1, b: 2, c: 3 })
    })
})
