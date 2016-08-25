import Store from "../store";
import PostModel from "../models/post.model";
import ProjectModel from "../models/project.model";
import PostPresenter from "../presenters/post.presenter";
import ProjectPresenter from "../presenters/project.presenter";
import {get, view} from "../router";
import ControllerBase from "./controller.base";

export default class HomeController extends ControllerBase {
    
    constructor(store: Store, request, response) {
        super(store);
    }

    @get("/")
    @view("home")
    async index() {
        return {
            isAdmin: this.isAdmin,
            posts: await this.getRecentPosts(),
            projects: await this.getTopProjects()
        };
    }

    private async getRecentPosts() {
        const posts = await this.store.posts
            .filter({ status: "publish" })
            .orderByDesc("date")
            .take(4)
            .toArray<PostModel>();

        return posts.map(x => new PostPresenter("read", x))
    }

    private async getTopProjects() {
        const projects = await this.store.projects
            .filter({ status: "publish" })
            .take(9)
            .orderByDesc("score")
            .toArray<ProjectModel>();

        return projects.map(x => new ProjectPresenter("read", x))
    }
}