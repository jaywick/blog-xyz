import { Request, Response } from 'express'
import { AboutPage } from '../views/pages/about'
import { ControllerBase } from '../views/controller-base'
import { MetadataProps } from '../views/components/metadata'
import { DataStore } from '../store';
import { Log } from '../utils/log';
import { Stats } from '../utils/stats';

export class About extends ControllerBase {

    constructor(store: DataStore, logs: Log, stats: Stats) {
        super(store, logs, stats)
    }

    meta(): MetadataProps {
        return { title: ['About', 'YOUR_NAME_HERE'] }
    }

    index(req: Request, res: Response) {
        this.render(res, new AboutPage({}))
    }

}