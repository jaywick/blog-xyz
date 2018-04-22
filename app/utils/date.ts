export const formatDate = (date: Date) =>
    date
    && typeof (date) === 'object'
    && (date.getFullYear() + '-' + (1 + date.getMonth()) + '-' + date.getDate())
    || ''

export const parseDate = (date: string) =>
    date
    && typeof (date) === 'string'
    && /^\d{4}-\d{1,2}-\d{1,2}$/.test(date)
    && new Date(date + 'T00:00:00.000')
    || null
