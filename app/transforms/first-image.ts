import { extract } from '../utils/regex'

export const FirstImage = <T extends { body: string }>(model: T) => Object.assign({
    firstImage: model.body && findImage(model.body) || ''
}, model)

const findImage = (markdown: string) => {
    return extract(markdown, /\!\[.+?\]\((.+?)\)/gi)
}
