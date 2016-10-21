import Store from "../store";
import PostModel from "../models/post.model";
import ProjectModel from "../models/project.model";
import AdminModel from "../models/admin.model";
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
        const unreadCounter = await this.getUnreadCommentCount();

        return {
            isAdmin: this.isAdmin,
            posts: await this.getRecentPosts(),
            projects: await this.getTopProjects(),
            unreadCount: this.isAdmin && unreadCounter,
            hasUnread: this.isAdmin && unreadCounter > 0
        };
    }

    private async getRecentPosts() {
        const posts = await this.store.posts
            .filter({ status: "publish" })
            .orderByDesc("date")
            .take(4)
            .toArray<PostModel>();

        const postIDs = posts
            .map(x => x.id);

        const comments = await this.store.comments
            .filterIn("postID", postIDs)
            .project(["postID"])
            .toArray<{ postID }>();

        posts.map(post => {
            post["commentCount"] = comments.filter(x => x.postID === post.id).length;
        });

        return posts.map(x => new PostPresenter("read", x));
    }

    private async getTopProjects() {
        const projects = await this.store.projects
            .filter({ status: "publish" })
            .take(9)
            .orderByDesc("score")
            .toArray<ProjectModel>();

        return projects.map(x => new ProjectPresenter("read", x))
    }

    private async getUnreadCommentCount() {
        const adminInfo = await this.store.admin.single<AdminModel>();
        const lastRead = adminInfo.lastCommentsRead;

        return await this.store.comments
            .filterOp("date", ">=", lastRead)
            .count();
    }
}