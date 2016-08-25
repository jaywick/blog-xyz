import Store from "../store";
import ProjectModel from "../models/project.model";
import ProjectPresenter from "../presenters/project.presenter";
import {get, post, view, restricted} from "../router";
import ControllerBase from "./controller.base";
import Log from "../utils/log";

export default class PortfolioController extends ControllerBase {
    
    constructor(store: Store, request, response) {
        super(store);
    }

    @get("/portfolio")
    @view("portfolio")
    async index() {
        const projects = await this.store.projects
            .filter({ status: "publish" })
            .orderByDesc("score")
            .toArray<ProjectModel>();
        
        return { projects: projects.map(x => new ProjectPresenter("read", x)) };
    }
    
    @restricted()
    @get("/portfolio/:key/edit")
    @view("project")
    async edit(key) {
        const post = await this.store.projects
            .filter({ key: key })
            .single<ProjectModel>();
        
        return new ProjectPresenter("update", post, this.isAdmin);
    }

    @restricted()
    @get("/portfolio/add")
    @view("project")
    add() {
        return new ProjectPresenter("create", null, this.isAdmin);
    }

    @get("/portfolio/:key")
    @view("project")
    async item(key) {
        const project = await this.store.projects
            .filter({ key: key })
            .single<ProjectModel>();
        
        return new ProjectPresenter("read", project, this.isAdmin);
    }

    @restricted()
    @post("/portfolio/save/add")
    async saveAdd(data) {
        await this.store.projects
            .insert({
                key: data.newKey || data.title.toLower().replace(" ", "-"),
                title: data.title,
                body: data.body,
                status: data.status,
                featureImage: data.featureImage,
                score: data.score,
                subtitle: data.subtitle,
                tags: []
            });
        
        Log.write(`Created project with key ${data.key}`, this.remoteIP);
        this.response.send({ redirect: `/portfolio/${data.key}` });
    }

    @restricted()
    @post("/portfolio/save/edit")
    async saveEdit(data) {
        await this.store.projects
            .filter({ key: data.key })
            .update({
                key: data.newKey,
                title: data.title,
                body: data.body,
                status: data.status,
                subtitle: data.subtitle,
                featureImage: data.featureImage,
                score: data.score,
                tags: []
            });
        
        Log.write(`Updated project where key = ${data.newKey}`, this.remoteIP);
        this.response.send({ redirect: `/portfolio/${data.newKey}` });
    }
}