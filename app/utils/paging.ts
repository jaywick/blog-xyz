
export const paging = (page: number, tag?: string) => {
    const tagPath = !tag ? '' : `/tag/${tag}`
    const prefix = `/blog${tagPath}/page/`

    const prev = page + 1
    const next = page - 1

    const prevUrl = prefix + prev
    let nextUrl = prefix + next

    if (next === 1)
        nextUrl = `/blog${tagPath}/`

    if (next === 0)
        nextUrl = null

    return { prev: prevUrl, next: nextUrl, current: page }
}
