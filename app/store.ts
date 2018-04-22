import { Log } from './utils/log'
import { MongoClient, ObjectID } from 'mongodb'

abstract class Store {
    protected client: MongoClient

    protected static baseUrl = 'mongodb://xyz-store:27017/'

    constructor(protected dbname: string) {
        this.client = MongoClient
    }

    protected query(collection: string): StoreQuery {
        return new StoreQuery(this.client, Store.baseUrl + this.dbname, collection)
    }
}

export class LoggingStore extends Store {
    constructor() {
        super('xyz-blog-logging')
    }

    public get logs() {
        return this.query('logs')
    }

    public get stats() {
        return this.query('stats')
    }
}

export class DataStore extends Store {

    constructor() {
        super('xyz-blog')
    }

    public get posts() {
        return this.query('posts')
    }

    public get projects() {
        return this.query('projects')
    }

    public get comments() {
        return this.query('comments')
    }

    public get logs() {
        return this.query('logs')
    }
}

export class StoreQuery {
    private condition: {} = {}
    private takeCount: number = null
    private skipCount: number = null
    private ordering: {}
    private projection: {} = { _id: false }

    constructor(private client, private url: string, private collection: string) {
    }

    all(): StoreQuery {
        return this.filter({})
    }

    filterId(id: string): StoreQuery {
        this.condition['_id'] = new ObjectID(id)
        return this
    }

    filterIn(field: string, values: any[]): StoreQuery {
        this.condition[field] = { '$in': values }
        return this
    }

    filter(condition: {}): StoreQuery {
        if (condition['_id'] != null)
            throw new Error('Cannot have filter() with _id. Use filterId instead')

        this.condition = condition
        return this
    }

    filterEq(field: string, value: any): StoreQuery {
        if (field === '_id')
            throw new Error('Cannot have filterEq() with field _id. Use filterId instead')

        this.condition[field] = value
        return this
    }

    filterOp(field: string, operation: '<' | '>' | '>=' | '<=' | '<>', value: any) {
        let opName

        switch (operation) {
            case '<':
                opName = '$lt'
                break
            case '<=':
                opName = '$lte'
                break
            case '>':
                opName = '$gt'
                break
            case '>=':
                opName = '$gte'
                break
            case '<>':
                opName = 'not'
                break
            default:
                throw new Error(`Invalid input to StoreQuery.filterOp. ${operation} is an invalid operation.`)
        }

        const predicate = {}
        predicate[opName] = value

        this.condition[field] = predicate
        return this
    }

    orderBy(field: string): StoreQuery {
        this.ordering = {}
        this.ordering[field] = -1
        return this
    }

    orderByDesc(field: string): StoreQuery {
        this.ordering = {}
        this.ordering[field] = -1
        return this
    }

    take(count: number): StoreQuery {
        this.takeCount = count
        return this
    }

    skip(count: number): StoreQuery {
        this.skipCount = count
        return this
    }

    page(index: number, itemsPerPage: number) {
        return this
            .skip(index * itemsPerPage)
            .take(itemsPerPage)
    }

    project(fields: string[]): StoreQuery {
        fields.forEach(x => this.projection[x] = true)
        return this
    }

    projectAll(): StoreQuery {
        this.projection = {}
        return this
    }

    remove(): Promise<{}> {
        return new Promise((resolve, reject) => {
            this.client.connect(this.url, (err, db) => {
                if (err) {
                    db && db.close()
                    reject(err)
                    return
                }

                try {
                    db.collection(this.collection)
                        .remove(this.condition)
                        .then(x => {
                            resolve()
                            db.close()
                        })
                }
                catch (ex2) {
                    console.error(`Failed to delete documents given conditions ${JSON.stringify(this.condition)}. ${JSON.stringify(ex2)}`)
                    reject(ex2)
                    db.close()
                }
            })
        })
    }

    autoincrement(keyField): Promise<number> {
        return new StoreQuery(this.client, this.url, this.collection)
            .project([keyField])
            .orderByDesc(keyField)
            .take(1)
            .scalar(1)
            .then(x => +x + 1)
    }

    insert(data: {}): Promise<{}> {
        return new Promise((resolve, reject) => {
            this.client.connect(this.url, (err, db) => {
                if (err) {
                    db && db.close()
                    reject(err)
                    return
                }

                try {
                    db.collection(this.collection)
                        .insert(data)
                        .then(x => {
                            resolve()
                            db.close()
                        })
                }
                catch (ex2) {
                    console.error(`Failed to insert data ${JSON.stringify(data)} given conditions ${JSON.stringify(this.condition)}. ${JSON.stringify(ex2)}`)
                    reject(ex2)
                    db.close()
                }
            })
        })
    }

    update(data: {}): Promise<{}> {
        return new Promise((resolve, reject) => {
            this.client.connect(this.url, (err, db) => {
                if (err) {
                    db && db.close()
                    reject(err)
                    return
                }

                try {
                    db.collection(this.collection)
                        .update(this.condition, { $set: data })
                    resolve()
                } catch (ex) {
                    console.error(`Failed to update data ${JSON.stringify(data)} given conditions ${JSON.stringify(this.condition)}. ${JSON.stringify(ex)}`)
                    reject(ex)
                }
                finally {
                    db.close()
                }
            })
        })
    }

    scalar<T>(defaultIfNone?): Promise<T> {
        return this.toArray()
            .then(x => {
                if (x.length === 0)
                    return defaultIfNone || null

                else if (x.length > 1)
                    console.error(`More than one match found at Store.scalar() for ${this.collection}?${JSON.stringify(this.condition)}. Returning first item silently.`)

                let scalarResult
                for (let prop in x[0]) {
                    scalarResult = x[0][prop]
                    break
                }

                if (scalarResult == null)
                    return defaultIfNone || null

                return scalarResult as T
            })
    }

    count(ignoreSkipAndTake?: boolean): Promise<number> {
        return new Promise((resolve, reject) => {
            this.client.connect(this.url, (err, db) => {
                if (err) {
                    if (!db && err.message.startsWith('connect ECONNREFUSED')) {
                        err.message = 'Cannot connect to database! ' + err.message
                        reject(err)
                        return
                    }

                    db && db.close()
                    reject(err)
                    return
                }

                let options = {}

                if (!ignoreSkipAndTake) {
                    if (this.skipCount != null)
                        options['skip'] = this.skipCount

                    if (this.takeCount != null)
                        options['limit'] = this.takeCount
                }

                db.collection(this.collection)
                    .count(this.condition || {}, options)
                    .then(result => {
                        db.close()
                        resolve(result)
                    }).catch(ex => {
                        db.close()
                        console.error(`Failed getting count Store.count() given conditions ${JSON.stringify(this.condition)} and options ${JSON.stringify(options)}. ${JSON.stringify(ex)}`)
                        reject(ex)
                    })
            })
        })
    }

    single<T>(defaultValue?: T): Promise<T> {
        return this.toArray()
            .then(x => {
                if (x.length === 0) {
                    if (defaultValue !== undefined) {
                        return defaultValue
                    }

                    console.error(`Cannot find item given conditions for at Store.single given ${this.collection}?${JSON.stringify(this.condition)}`)
                    throw new Error(`Cannot find item given conditions for ${this.collection}?${JSON.stringify(this.condition)}`)
                }
                else if (x.length > 1)
                    console.error(`More than one match found at Store.single given ${this.collection}?${JSON.stringify(this.condition)}. Returning first item silently.`)

                return x[0] as T
            })
    }

    toPagable<T>(): Promise<{ results: T[], count: number }> {
        let count = 0

        return this.count(true)
            .then(x => {
                count = x
                return this.toArray<T>()
            }).then(x => ({
                results: x,
                count: count
            }))
    }

    toArray<T extends {}>(): Promise<T[]> {
        return new Promise((resolve, reject) => {
            this.client.connect(this.url, (err, db) => {
                if (err) {
                    if (!db && err.message.startsWith('connect ECONNREFUSED')) {
                        err.message = 'Cannot connect to database! ' + err.message
                        reject(err)
                        return
                    }

                    db && db.close()
                    reject(err)
                    return
                }

                let cursor
                try {
                    cursor = db.collection(this.collection)
                        .find(this.condition || {}, this.projection)

                    if (this.skipCount != null)
                        cursor.skip(this.skipCount)

                    if (this.takeCount != null)
                        cursor.limit(this.takeCount)

                    if (this.ordering != null)
                        cursor.sort(this.ordering)
                } catch (ex) {
                    db.close()
                    console.error(`Failed setting up cursor in Store.toArray() given conditions ${JSON.stringify(this.condition)}. ${JSON.stringify(ex)}`)
                    reject(ex)
                    return
                }

                cursor.toArray((err2, result) => {
                    if (err2) {
                        db.close()
                        console.error(`Failed to materialise array of results in Store.toArray() given conditions ${JSON.stringify(this.condition)}. ${JSON.stringify(err)}`)
                        reject(err2)
                        return
                    }

                    db.close()
                    resolve(result)
                })
            })
        })
    }
}