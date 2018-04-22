import { markdown } from '../utils/markdown'

export const Html = <T extends { body: string }>(model: T) => Object.assign({
    bodyHtml: model.body && markdown(model.body) || ''
}, model)
