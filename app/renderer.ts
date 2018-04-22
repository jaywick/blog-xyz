const { renderToString, renderToStaticMarkup } = require('react-dom/server')

export const render = (component: React.Component): string => renderToStaticMarkup(component.render())
