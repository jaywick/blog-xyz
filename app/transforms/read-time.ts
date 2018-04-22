const readSpeed = 250 // wpm
const imageSpeed = 5 / 60 // 5s per image
const words = (text: string) => (text.match(/\S+/g) || []).length
const images = (text: string) => (text.match(/\!\[.+?\]\(.+?\)/g) || []).length

export const ReadTime = <T extends { body: string }>(model: T): T & { readTime: number } => Object.assign({
    readTime: model.body && Math.ceil(words(model.body) / readSpeed + images(model.body) * imageSpeed) || null
}, model)
