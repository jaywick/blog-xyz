import { Application } from 'express'
import { DataStore } from './store'
import { Blog } from './routes/blog'
import { Home } from './routes/home'
import { About } from './routes/about'
import { Portfolio } from './routes/portfolio'
import { Default } from './routes/default'
import { Log } from './utils/log';
import { Stats } from './utils/stats';
import { Request, Response } from 'express'

const incrementPageView = (stats: Stats, req: Request) =>
    stats.increment('Page view', { ip: req.ip }, { url: req.url })

export const registerRoutes = (app: Application, store: DataStore, log: Log, stats: Stats) => {
    const blog = new Blog(store, log, stats)
    const portfolio = new Portfolio(store, log, stats)
    const about = new About(store, log, stats)
    const home = new Home(store, log, stats)
    const default_ = new Default(store, log, stats)

    app.get('/about', (req, res) => {
        incrementPageView(stats, req)
        about.index(req, res)
    })

    app.get('/portfolio', (req, res) => {
        incrementPageView(stats, req)
        portfolio.index(req, res)
    })

    app.get('/portfolio/:name', (req, res) => {
        incrementPageView(stats, req)
        portfolio.item(req, res, req.params.name)
    })

    app.get('/blog', (req, res) => {
        incrementPageView(stats, req)
        blog.index(req, res)
    })

    app.get('/blog/page/:page', (req, res) => {
        incrementPageView(stats, req)
        blog.index(req, res, +(req.params.page || 0))
    })

    app.get('/blog/tag/:tag', (req, res) => {
        incrementPageView(stats, req)
        blog.tag(req, res, req.params.tag)
    })

    app.get('/blog/tag/:tag/page/:page', (req, res) => {
        incrementPageView(stats, req)
        blog.tag(req, res, req.params.tag, +(req.params.page || 0))
    })

    app.get('/blog/:id/:slug?', (req, res) => {
        incrementPageView(stats, req)
        blog.item(req, res, +req.params.id, req.params.slug)
    })

    app.get('/', (req, res) => {
        incrementPageView(stats, req)
        home.index(req, res)
    })

    app.get('*', (req, res) => {
        stats.increment('Uncaught route', { ip: req.ip }, { url: req.url })
        default_.all(req, res)
    })
}
