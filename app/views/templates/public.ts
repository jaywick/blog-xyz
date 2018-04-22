const bannerIfIE = '<div class="ie-banner" style="display: none">Items may not appear correctly on Internet Explorer &mdash;&nbsp;<a href="https://www.microsoft.com/en-au/windowsforbusiness/end-of-ie-support">find out why</a></div>'

export const publicTemplate = (data: { props: string, page: string, metadata: string, isDebug: boolean }) => [
    '<!DOCTYPE html>',
    '<html lang="en">',
    '<head>',
    '<meta charset="utf-8"/>',
    '<meta name="viewport" content="width=device-width, initial-scale=1"/>',
    '<meta name="author" content="YOUR_NAME_HERE"/>',
    `<meta name="description" content="YOUR_SITE_DESCRIPTION_HERE"/>`,
    '<meta name="theme-color" content="#398BB6"/>',
    '<link rel="stylesheet" href="/css/style.css" type="text/css">',
    '<link rel="stylesheet" href="https://fonts.googleapis.com/css?family=Montserrat:500,700" type="text/css" />',
    '<link rel="stylesheet" href="/highlight-styles/current.css" type="text/css" />',
    '<link rel="shortcut icon" type="image/png" href="/favicon.png" />',
    data.metadata,
    '</head>',
    '<body>',
    bannerIfIE,
    data.page,
    '<script src="/ie-warn.js"></script>',
    '</body>',
    '</html>'
].join(data.isDebug ? '\n' : '')
