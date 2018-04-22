import * as moment from 'moment'

export const RelativeDate = <T extends { date }>(model: T) => Object.assign({
    relativeDate: model.date && moment(model.date).format('MMM D, YYYY')
}, model)
