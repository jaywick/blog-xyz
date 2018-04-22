import { snippet } from '../utils/markdown'

export const Snippet = <T extends { body: string }>(model: T) => Object.assign({
    snippet: model.body && snippet(model.body) || ''
}, model)
