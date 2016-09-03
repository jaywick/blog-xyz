import {Promise} from "es6-promise";
import * as mongodb from "mongodb";
import AdminModel from "./models/admin.model";
import PostModel from "./models/post.model";
import ProjectModel from "./models/project.model";
import CommentModel from "./models/comment.model";
import LogModel from "./models/log.model";
import Log from "./utils/log";

export default class Store {
    private client;
    private static url = "mongodb://127.0.0.1:27017/jaywick-xyz";

    constructor() {
        this.client = mongodb.MongoClient;
    }

    private query(collection: string): StoreQuery {
        return new StoreQuery(this.client, Store.url, collection);
    }

    public get posts() {
        return this.query(PostModel.collection);
    }

    public get projects() {
        return this.query(ProjectModel.collection);
    }

    public get comments() {
        return this.query(CommentModel.collection);
    }

    public get admin() {
        return this.query(AdminModel.collection)
    }

    public get logs() {
        return this.query(LogModel.collection)
    }
}

export class StoreQuery {
    private condition: {} = {};
    private takeCount: number = null;
    private skipCount: number = null;
    private ordering: {};
    private projection: {} = { _id: false };

    constructor(private client, private url: string, private collection: string) {
    }

    filterId(id: string): StoreQuery {
        this.condition = { _id: new mongodb.ObjectID(id) };

        return this;
    }

    filter(condition: {}): StoreQuery {
        if (condition["_id"] != null)
            throw new Error("Cannot have filter() with _id. Use filterId instead");

        this.condition = condition;
        return this;
    }

    filterEq(field: string, value: any): StoreQuery {
        if (field === "_id")
            throw new Error("Cannot have filterEq() with field _id. Use filterId instead");

        this.condition = {};
        this.condition[field] = value;
        return this;
    }

    orderBy(field: string, isDescending?: boolean): StoreQuery {
        if (isDescending)
            return this.orderByDesc(field);

        this.ordering = {};
        this.ordering[field] = 1;
        return this;
    }

    orderByDesc(field: string): StoreQuery {
        this.ordering = {};
        this.ordering[field] = -1;
        return this;
    }

    take(count: number): StoreQuery {
        this.takeCount = count;
        return this;
    }

    skip(count: number): StoreQuery {
        this.skipCount = count;
        return this;
    }

    project(fields: string[]): StoreQuery {
        fields.forEach(x => this.projection[x] = true);
        return this;
    }

    projectAll(): StoreQuery {
        this.projection = {};
        return this;
    }

    remove(): Promise<{}> {
        return new Promise((resolve, reject) => {
            this.client.connect(this.url, (err, db) => {
                if (err) {
                    db && db.close();
                    reject(err);
                    return;
                }

                try {
                    db.collection(this.collection)
                        .remove(this.condition)
                        .then(x => {
                            resolve();
                            db.close();
                        });
                }
                catch (ex2) {
                    Log.fail(`Failed to delete documents given conditions ${JSON.stringify(this.condition)}. ${JSON.stringify(ex2)}`)
                    reject(ex2);
                    db.close();
                }
            });
        });
    }

    autoincrement(keyField): Promise<number> {
        return new StoreQuery(this.client, this.url, this.collection)
            .project([keyField])
            .orderByDesc(keyField)
            .take(1)
            .scalar(1)
            .then(x => +x + 1);
    }

    insert(data: {}): Promise<{}> {
        return new Promise((resolve, reject) => {
            this.client.connect(this.url, (err, db) => {
                if (err) {
                    db && db.close();
                    reject(err);
                    return;
                }

                try {
                    db.collection(this.collection)
                        .insert(data)
                        .then(x => {
                            resolve();
                            db.close();
                        });
                }
                catch (ex2) {
                    Log.fail(`Failed to insert data ${JSON.stringify(data)} given conditions ${JSON.stringify(this.condition)}. ${JSON.stringify(ex2)}`)
                    reject(ex2);
                    db.close();
                }
            });
        });
    }

    update(data: {}): Promise<{}> {
        return new Promise((resolve, reject) => {
            this.client.connect(this.url, (err, db) => {
                if (err) {
                    db && db.close();
                    reject(err);
                    return;
                }

                try {
                    db.collection(this.collection)
                        .update(this.condition, {$set: data} );
                    resolve();
                } catch (ex) {
                    Log.fail(`Failed to update data ${JSON.stringify(data)} given conditions ${JSON.stringify(this.condition)}. ${JSON.stringify(ex)}`)
                    reject(ex);
                }
                finally {
                    db.close();
                }
            });
        });
    }

    scalar<T>(defaultIfNone?): Promise<T> {
        return this.toArray()
            .then(x => {
                if (x.length === 0)
                    return defaultIfNone;
                else if (x.length > 1)
                    Log.fail(`More than one match found at Store.scalar() for ${this.collection}?${JSON.stringify(this.condition)}. Returning first item silently.`);

                let scalarResult;
                for (let prop in x[0]) {
                    scalarResult = x[0][prop];
                    break;
                }

                if (scalarResult == null)
                    return defaultIfNone;

                return scalarResult as T;
            });
    }

    single<T>(): Promise<T> {
        return this.toArray()
            .then(x => {
                if (x.length === 0)
                {
                    Log.fail(`Cannot find item given conditions for at Store.single given ${this.collection}?${JSON.stringify(this.condition)}`);
                    throw new Error(`Cannot find item given conditions for ${this.collection}?${JSON.stringify(this.condition)}`);
                }
                else if (x.length > 1)
                    Log.fail(`More than one match found at Store.single given ${this.collection}?${JSON.stringify(this.condition)}. Returning first item silently.`);

                return x[0] as T;
            });
    }

    toArray<T>(): Promise<T[]> {
        return new Promise((resolve, reject) => {
            this.client.connect(this.url, (err, db) => {
                if (err) {
                    if (!db && err.message.startsWith("connect ECONNREFUSED"))
                    {
                        err.message = "Cannot connect to database! " + err.message; 
                        reject(err);
                        return;
                    }

                    db && db.close();
                    reject(err);
                    return;
                }

                let cursor;
                try {
                    cursor = db.collection(this.collection)
                        .find(this.condition || {}, this.projection);

                    if (this.skipCount != null)
                        cursor.skip(this.skipCount);

                    if (this.takeCount != null)
                        cursor.limit(this.takeCount);

                    if (this.ordering != null)
                        cursor.sort(this.ordering);
                } catch (ex) {
                    db.close();
                    Log.fail(`Failed setting up cursor in Store.toArray() given conditions ${JSON.stringify(this.condition)}. ${JSON.stringify(ex)}`)
                    reject(ex);
                    return;
                }

                cursor.toArray((err2, result) => {
                    if (err2) {
                        db.close();
                        Log.fail(`Failed to materialise array of results in Store.toArray() given conditions ${JSON.stringify(this.condition)}. ${JSON.stringify(err)}`)
                        reject(err2);
                        return;
                    }

                    db.close();
                    resolve(result);
                });
            });
        });
    }   
}