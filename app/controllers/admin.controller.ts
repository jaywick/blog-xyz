import Store from "../store";
import PostModel from "../models/post.model";
import ProjectModel from "../models/project.model";
import CommentModel from "../models/comment.model";
import LogModel from "../models/log.model";
import {get, post, view, restricted, upload} from "../router";
import ControllerBase from "./controller.base";
import Log from "../utils/log";
import AdminBlogPresenter from "../presenters/admin.blog.presenter";
import AdminLogsPresenter from "../presenters/admin.logs.presenter";
import AdminPortfolioPresenter from "../presenters/admin.portfolio.presenter";
import AdminCommentPresenter from "../presenters/admin.comment.presenter";
import AdminModel from "../models/admin.model";

export default class AdminController extends ControllerBase {
    static PAGE_LIMIT = 50;

    constructor(store: Store) {
        super(store);
    }

    // GETTERS
    @restricted()
    @get("/admin/blog")
    @view("admin/blog")
    blog(sortby?) {
        return this.sortBlog("date");
    }

    @restricted()
    @get("/admin/blog/sort/:sortby")
    @view("admin/blog")
    async sortBlog(sortby) {
        const posts = await this.store.posts
            .orderByDesc(sortby)
            .toArray<PostModel>();

        return new AdminBlogPresenter(posts);
    }

    @restricted()
    @get("/admin/blog/filter/:field/:value")
    @view("admin/blog")
    async filterBlog(field, value) {
        const posts = await this.store.posts
            .filterEq(field, value)
            .orderByDesc("date")
            .toArray<PostModel>();

        return new AdminBlogPresenter(posts, value);
    }

    @restricted()
    @get("/admin/portfolio")
    @view("admin/portfolio")
    portfolio() {
        return this.sortPortfolio(null);
    }

    @restricted()
    @get("/admin/portfolio/sort/:sort/:direction?")
    @view("admin/portfolio")
    async sortPortfolio(sort, direction?) {
        const desc = direction && (direction.toLowerCase() === "desc" || direction.toLowerCase() === "descending");
        const projects = await this.store.projects
            .orderBy({field: sort, isDescending: desc})
            .toArray<ProjectModel>();

        return new AdminPortfolioPresenter(projects);
    }

    @restricted()
    @get("/admin/logs")
    @view("admin/logs")
    async logs() {
        const page = this.options.page;
        const limit = this.options.limit || AdminController.PAGE_LIMIT;

        const logs = await this.store.logs
            .filter(this.options.filter)
            .orderBy(this.options.sort || { field: "date", isDescending: true })
            .page(page, limit)
            .toPagable<LogModel>()

        return new AdminLogsPresenter(logs.results, this.options.filter["severity"], { limit: limit, index: page, count: logs.count });
    }

    @restricted()
    @get("/admin/comments")
    @view("admin/comments")
    async comments() {
        const posts = await this.store.posts
            .project(["id", "title", "status"])
            .toArray<{ id; title; status }>();

        const comments = await this.store.comments
            .projectAll()
            .orderByDesc("date")
            .toArray<CommentModel>()

        const admin = await this.store.admin.single<AdminModel>();
        this.store.admin.filter({user: admin.user}).update({lastCommentsRead: new Date()});

        return new AdminCommentPresenter(comments, posts, admin.lastCommentsRead);
    }

    // ACTIONS
    @restricted()
    @post("/admin/blog/delete")
    async deletePost(data: { id }) {
        await this.store.posts
            .filter({ id: +data.id })
            .remove();
    }

    @restricted()
    @post("/admin/blog/update")
    async updatePost(data: { id; status }) {
        await this.store.posts
            .filter({ id: +data.id })
            .update({ status: data.status });
    }

    @restricted()
    @post("/admin/portfolio/delete")
    async deleteProject(data: { key }) {
        await this.store.projects
            .filter({ key: data.key })
            .remove();
    }

    @restricted()
    @post("/admin/portfolio/update")
    async updateProject(data: { key; status }) {
        await this.store.projects
            .filter({ key: data.key })
            .update({ status: data.status });
    }

    @restricted()
    @upload("/admin/upload")
    upload() {
        // no code needed, magic happens thanks to multer middleware
    }
}