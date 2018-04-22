import { extractFirst } from './utils/regex'
import { registerRoutes } from './routing'
import { getArgs } from './utils/args'
import { Log } from './utils/log'
import { Stats } from './utils/stats'
import { DataStore } from './store'

import * as express from 'express'
import { Application } from 'express'
import * as http from 'http'
import * as https from 'https'
import * as fs from 'fs'
import * as bodyParser from 'body-parser'
import * as compression from 'compression'

export class App {

    constructor(private store: DataStore, private log: Log, private stats: Stats) {
    }

    start() {
        const app = express()
            .set('views', `${__dirname}/views`)
            .use(compression())
            .use(express.static('res'))
            .use(bodyParser.json())
            .use(bodyParser.urlencoded({ extended: true }))

        registerRoutes(app, this.store, this.log, this.stats)

        const [ port = 80 ] = process.argv.slice(2)
        http.createServer(app).listen(port)
    }
}
