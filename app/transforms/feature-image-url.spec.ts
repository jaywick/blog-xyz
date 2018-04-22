import { FeatureImageThumbUrl, FeatureImageFullUrl, publicImgUrl } from './feature-image-url'

const rootPath = publicImgUrl([])

describe('FeatureImageThumbUrl transform', () => {
    it('should prepend `-thumb` to filename', () => {
        const result = FeatureImageThumbUrl({featureImage: 'bob.ext', id: 1})
        expect(result.featureImageThumbUrl).toBe(rootPath + '1/bob-thumb.ext')
    })

    it('should fallback to full image path if no ext', () => {
        const result = FeatureImageThumbUrl({featureImage: 'bob', id: 1})
        expect(result.featureImageThumbUrl).toBe(rootPath + '1/bob')
    })

    it('should give path to fill image', () => {
        const result = FeatureImageFullUrl({featureImage: 'bob.ext', id: 1})
        expect(result.featureImageUrl).toBe(rootPath + '1/bob.ext')
    })
})
