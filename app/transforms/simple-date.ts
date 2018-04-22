import * as moment from 'moment'

export const SimpleDate = <T extends { date }>(model: T) => Object.assign({
    simpleDate: model.date && moment(model.date).format('DD/MM/YYYY')
}, model)
