import * as express from 'express'
import * as moment from 'moment'
import { BlogPage } from '../views/pages/blog'
import { extract } from '../utils/regex'
import { render } from '../renderer'
import { ControllerBase } from '../views/controller-base'
import { NotFoundError } from '../errors'
import { DataStore } from '../store'
import { Log } from '../utils/log'
import { Stats } from '../utils/stats'

export class Default extends ControllerBase {

    constructor(store: DataStore, logs: Log, stats: Stats) {
        super(store, logs, stats)
    }

    all(req: express.Request, res: express.Response) {
        const url = this.resolveRedirect(req.url)

        if (!url) {
            this.error(req, res, new NotFoundError(req.url))
            return
        }

        res.redirect(url)
    }

    resolveRedirect(link: string): string {
        if (link == null || link === '' || link === '/')
            return '/'

        if ((/^\/?(?:labs?|portfolios?|projects?)\/?$/i).test(link))
            return '/portfolio'

        if ((/^\/?blog\/?$/i).test(link))
            return '/blog'

        if ((/^\/?about\/?$/i).test(link))
            return '/about'

        const projectExtract = extract(link, /^\/?(?:labs?|portfolios?|projects?)\/([^\/]+)\/?$/i)

        if (projectExtract)
            return `/portfolio/${projectExtract}`

        const postExtract = extract(link, /^\/?(?:blog\/?)?(\d+)(?:\/[a-z-]+)?\/?$/i)

        if (postExtract)
            return `/blog/${postExtract}`

        return null
    }
}