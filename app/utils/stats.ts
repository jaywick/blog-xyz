import { LoggingStore } from '../store'

export class Stats {

    constructor(private store: LoggingStore) {
    }

    increment(statistic: string, source: {}, metadata: {}) {
        if (!this.store) {
            console.error(`Failed to increment statistic ${statistic}`)
            return
        }

        this.store.stats.insert({
            statistic,
            date: new Date(),
            source,
            metadata,
        })
    }
}
