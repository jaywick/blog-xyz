import { Request, Response } from 'express'
import * as moment from 'moment'

import { HomePage } from '../views/pages/home'
import { ControllerBase } from '../views/controller-base'
import { ReadTime } from '../transforms/read-time'
import { RelativeDate } from '../transforms/relative-date'
import { Snippet } from '../transforms/snippet'
import { FeatureImageThumbUrl } from '../transforms/feature-image-url'
import { DataStore } from '../store';
import { Log } from '../utils/log';
import { Stats } from '../utils/stats';

export class Home extends ControllerBase {

    constructor(store: DataStore, logs: Log, stats: Stats) {
        super(store, logs, stats)
    }

    index(req: Request, res: Response) {
        Promise
            .all([
                this.store.posts
                    .filter({ status: 'publish' })
                    .orderByDesc('date')
                    .take(6)
                    .project(['id', 'title', 'body', 'date', 'slug', 'featureImage'])
                    .toArray<{ id, title, body, date, slug, featureImage }>()
                    .then(posts => posts
                        .map(x => Object.assign({ commentCount: 0 }, x))
                        .map(FeatureImageThumbUrl)
                        .map(RelativeDate)
                        .map(Snippet)
                        .map(ReadTime)),
                this.store.projects
                    .filter({ status: 'publish' })
                    .take(9)
                    .orderByDesc('score')
                    .project(['key', 'title', 'featureImage', 'subtitle'])
                    .toArray<{ key, title, featureImage, subtitle }>()
                    .then(projects => projects
                        .map(FeatureImageThumbUrl))
            ])
            .then(([posts, projects]) => new HomePage({ posts, projects }))
            .then(page => this.render(res, page))
            .catch(err => this.error(req, res, err))
    }
}
