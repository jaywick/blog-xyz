import * as marked from 'marked'

/**
 * Returns HTML from Markdown
 */
export const markdown = (code: string) => {
    const preparsedCode = code
        .split('\n')

        // filter out splitter
        .filter(x => x.indexOf('****') !== 0)
        .join('\n')

        // convert image descriptions into captions
        //.replace(/!\[(.+?)\]\((.+?)\)/, '![]($2)\n<caption>$1</caption>')

        // footnote definition
        .replace(/\[\^(\d+?)\]\:/g, '<a class="footnote-backlink" href="#footnote-$1-backref">&#11025;</a> <span id="#footnote-$1" class="footnote">$1:</span> ')

        // footnote backlink
        .replace(/\[\^(\d+?)\]/g, '\\[<a href="#footnote-$1"><span class="footnote-name" id="#footnote-$1-backref">$1</span></a>\\]')

    return marked(preparsedCode);
}

/**
 * Returns plain text snippet
 */
export const snippet = (code: string) => {
    return code
        .split("\n")
        .filter(x => x.indexOf('#') !== 0)    // filter out headings
        .filter(x => x.indexOf('-') !== 0)    // filter list items
        .filter(x => x.indexOf('    ') !== 0) // filter out code
        .filter(x => x.indexOf('```') !== 0)  // filter out code
        .filter(x => x.indexOf('****') !== 0) // filter out splitter
        .filter(x => x.indexOf('==') !== 0)   // filter headers
        .filter(x => x.indexOf('--') !== 0)   // filter horizontal lines
        .slice(0, 3).join(' ')                // merge first 3 paragraphs as sentences
        .split('. ').slice(0, 4).join('. ')   // get first 4 sentences
        .replace(/\!\[(.+?)\]\(.+?\)/gi, '')  // remove image syntax
        .replace(/\[(.+?)\]\(.+?\)/gi, '$1')  // swap linked text with text
        .replace(/`(.+?)`/gi, '<i>$1</i>')    // swap code with italics
        .replace(/\*\*(.+?)\*\*/gi, '<i>$1</i>') // swap bold syntax with italics
        .replace(/\*(.+?)\*/gi, '<i>$1</i>')   // swap italics syntax with italics
        .replace(/\<sup\>(.+?)\<\/sup\>/gi, '<i>$1</i>')  // swap sup with italics
        .replace(/\<sub\>(.+?)\<\/sub\>/gi, '<i>$1</i>')  // swap sub syntax with italics
        .replace(/\<kbd\>(.+?)\<\/kbd\>/gi, '<i>$1</i>') // swap keyboard shortcuts with italics
        .replace(/\<caption\>(.+?)\<\/caption\>/gi, '') // remove captions
}

/**
 * Returns HTML before splitter
 */
export const summarise = (code: string) => {
    const breakPosition = code.indexOf('****')

    if (breakPosition === -1)
        return markdown(code)

    const truncated = code.substring(0, breakPosition)
    return markdown(truncated)
}