const appendThumb = (filename) => filename.replace(/(\.[^/.]+)$/i, '-thumb$1')

export const publicImgUrl = (paths: any[]) =>
    'https://YOUR_REGION_HERE.amazonaws.com/YOUR_S3_BUCKET_HERE/' + paths.join('/')

export const FeatureImageThumbUrl = <T extends { featureImage: string, id?: number, key?: string }>(model: T) => Object.assign({
    featureImageThumbUrl: model.featureImage && publicImgUrl([model.id || model.key, appendThumb(model.featureImage)])
}, model)

export const FeatureImageFullUrl = <T extends { featureImage: string, id?: number, key?: string }>(model: T) => Object.assign({
    featureImageUrl: model.featureImage && publicImgUrl([model.id || model.key, model.featureImage])
}, model)
