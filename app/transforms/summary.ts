import { summarise } from '../utils/markdown'

export const Summary = <T extends { body: string }>(model: T) => Object.assign({
    summary: model.body && summarise(model.body) || ''
}, model)
