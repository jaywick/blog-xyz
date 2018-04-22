import { Request, Response } from 'express'
import { ControllerBase } from '../views/controller-base'
import { PortfolioPage } from '../views/pages/portfolio'
import { ProjectPage } from '../views/pages/project'
import { Html } from '../transforms/html'
import { FirstImage } from '../transforms/first-image'
import { FeatureImageThumbUrl } from '../transforms/feature-image-url'
import { NotFoundError } from '../errors'
import { DataStore } from '../store';
import { Log } from '../utils/log';
import { Stats } from '../utils/stats';

export class Portfolio extends ControllerBase {

    constructor(store: DataStore, logs: Log, stats: Stats) {
        super(store, logs, stats)
    }

    index(req: Request, res: Response) {
        this.store.projects
            .filter({ status: 'publish' })
            .orderByDesc('score')
            .project(['key', 'title', 'featureImage', 'subtitle'])
            .toArray<{ key, title, featureImage, subtitle }>()
            .then(projects => projects
                .map(FeatureImageThumbUrl))
            .then(projects => new PortfolioPage({ projects }))
            .then(page => this.render(res, page))
            .catch(err => this.error(req, res, err))
    }

    item(req: Request, res: Response, name: string) {
        this.store.projects
            .filter({ key: name, status: 'publish' })
            .project(['title', 'subtitle', 'body'])
            .single<{ title, subtitle, body }>(null)
            .then(project => {
                if (project == null)
                    throw new NotFoundError()

                return project
            })
            .then(project => [project]
                .map(Html)
                .map(FirstImage)[0])
            .then(project => this.render(res, new ProjectPage(project)))
            .catch((err: Error) => this.error(req, res, err))
    }
}
