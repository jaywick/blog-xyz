import * as express from 'express'
import { Request, Response } from 'express'
import * as moment from 'moment'
import { BlogPage } from '../views/pages/blog'
import { PostPage } from '../views/pages/post'
import { render } from '../renderer'
import { ControllerBase } from '../views/controller-base'
import { ReadTime } from '../transforms/read-time'
import { RelativeDate } from '../transforms/relative-date'
import { FeatureImageThumbUrl, FeatureImageFullUrl } from '../transforms/feature-image-url'
import { Summary } from '../transforms/summary'
import { Html } from '../transforms/html'
import { NotFoundError, RedirectError } from '../errors'
import { paging } from '../utils/paging'
import { Snippet } from '../transforms/snippet'
import { Stats } from '../utils/stats'
import { Log } from '../utils/log'
import { DataStore } from '../store'

export class Blog extends ControllerBase {

    private pageLimit = 8

    constructor(store: DataStore, logs: Log, stats: Stats) {
        super(store, logs, stats)
    }

    index(req: Request, res: Response, page: number = 1) {
        this.store.posts
            .filter({ status: 'publish' })
            .orderByDesc('date')
            .skip(this.pageLimit * (page - 1))
            .take(this.pageLimit)
            .project(['id', 'title', 'body', 'date', 'slug', 'featureImage', 'status'])
            .toArray<{ id, title, body, date, slug, featureImage, status }>()
            .then(posts => posts
                .map(x => Object.assign({ commentCount: 0 }, x))
                .map(ReadTime)
                .map(Summary)
                .map(RelativeDate)
                .map(FeatureImageFullUrl))
            .then(posts => new BlogPage({ posts, paging: paging(page) }))
            .then(page => this.render(res, page))
            .catch(err => this.error(req, res, err))
    }

    tag(req: Request, res: Response, tag: string, page: number = 1) {
        this.store.posts
            .filter({ status: 'publish', tags: tag })
            .orderByDesc('date')
            .skip(this.pageLimit * (page - 1))
            .take(this.pageLimit)
            .project(['id', 'title', 'body', 'date', 'slug', 'featureImage', 'status'])
            .toArray<{ id, title, body, date, slug, featureImage, status }>()
            .then(posts => posts
                .map(x => Object.assign({ commentCount: 0 }, x))
                .map(ReadTime)
                .map(Summary)
                .map(RelativeDate)
                .map(FeatureImageFullUrl))
            .then(posts => new BlogPage({ posts, tag, paging: paging(page, tag) }))
            .then(page => this.render(res, page))
            .catch(err => this.error(req, res, err))
    }

    item(req: Request, res: Response, id: number, slug: string) {
        this.store.posts
            .filter({ id, status: 'publish' })
            .project(['id', 'title', 'body', 'date', 'slug', 'tags', 'featureImage', 'originalUrl', 'status'])
            .single<{ id, title, body, date, slug, tags, featureImage, originalUrl, status }>(null)
            .then(post => {
                if (post == null)
                    throw new NotFoundError()
                else if (post.slug !== slug)
                    throw new RedirectError(`/blog/${id}/${post.slug}`, req.originalUrl)
                else
                    return post
            })
            .then(post => [post]
                .map(x => Object.assign({ commentCount: 0 }, x))
                .map(ReadTime)
                .map(Html)
                .map(RelativeDate)
                .map(Snippet)
                .map(FeatureImageFullUrl)
                .map(FeatureImageThumbUrl)[0])
            .then(post => new PostPage(post))
            .then(page => this.render(res, page))
            .catch(err => this.error(req, res, err))
    }
}
