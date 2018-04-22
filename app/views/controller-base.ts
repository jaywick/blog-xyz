import * as express from 'express'
import { ErrorPage } from './pages/error'
import { render } from '../renderer'
import { Metadata, MetadataProps } from './components/metadata'
import { DataStore } from '../store'
import { NotFoundError, RedirectError } from '../errors'
import { isDebug } from '../utils/debug'
import { publicTemplate } from './templates/public'
import { Log } from '../utils/log';
import { Stats } from '../utils/stats';

type ReactComponentWithOptionalMetaData = React.Component & { meta?(): MetadataProps }

export class ControllerBase {

    private templateMap = {
        public: publicTemplate,
    }

    constructor(protected store: DataStore, protected log: Log, protected stats: Stats) {
    }

    protected render(res: express.Response, page: ReactComponentWithOptionalMetaData, template = 'public') {
        const templateFn = this.templateMap[template]
        const payload = templateFn({
            props: JSON.stringify(page.props),
            page: render(page),
            metadata: page.meta && render(new Metadata(page.meta())),
            isDebug: isDebug(),
        })

        res.send(payload)
    }

    protected error<TError extends Error>(req: express.Request, res: express.Response, err: TError) {
        this.log.warn(err.message, req.ip)

        if (err instanceof RedirectError) {
            res.redirect(err.url)
            return
        }

        if (err instanceof NotFoundError) {
            this.render(res, new ErrorPage({ message: 'The page you were looking for was not found.' }))
            return
        }

        if (isDebug()) {
            this.render(res, new ErrorPage({ message: 'Unhandled exception', err }))
            throw new Error(err + '')
        }

        this.render(res, new ErrorPage({ message: 'An unexpected error occured getting your packets through the interwebs!'}))
    }
}
