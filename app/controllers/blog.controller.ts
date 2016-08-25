import Store from "../store";
import PostModel from "../models/post.model";
import PostPresenter from "../presenters/post.presenter";
import {get, post, view, restricted} from "../router";
import ControllerBase from "./controller.base";
import Log from "../utils/log";

export default class BlogController extends ControllerBase {
    static PAGE_LIMIT = 8;

    constructor(store: Store, request, response) {
        super(store);
    }

    @get("/blog")
    @view("blog")
    index() {
        return this.page(0);
    }

    @get("/blog/page/:page")
    @view("blog")
    async page(page) {
        const posts = await this.store.posts
            .filter({ status: "publish" })
            .orderByDesc("date")
            .take(BlogController.PAGE_LIMIT)
            .skip(+page * BlogController.PAGE_LIMIT)
            .toArray<PostModel>();

        return {
            posts: posts.map(x => new PostPresenter("read", x)),
            isAdmin: this.isAdmin,
            paging: this.getPagingInfo(+page)
        };
    }

    @restricted()
    @get("/blog/add")
    @view("post")
    add() {
        return new PostPresenter("create", null, null, true);
    }

    @restricted()
    @post("/blog/save/add")
    async saveAdd(data) {
        const newID = await this.store.posts
            .autoincrement("id");
        
        await this.store.posts
            .insert({
                id: newID,
                title: data.title,
                body: data.body,
                status: data.status,
                slug: data.slug || data.title.toLower().replace(" ", "-"),
                date: Date,
                tags: [],
                featureImage: data.featureImage,
                originalUrl: ""
            });
        
        Log.write(`Created post with ID ${newID}`, this.remoteIP);
        this.response.send({ redirect: `/blog/${newID}` });
    }

    @restricted()
    @get("/blog/edit/:id")
    @view("post")
    async edit(id) {
        const post = await this.store.posts
            .filter({ id: +id })
            .single<PostModel>();
        
        return new PostPresenter("update", post, null, this.isAdmin);
    }

    @restricted()
    @post("/blog/save/edit")
    async saveEdit(data) {
        await this.store.posts
            .filter({ id: +data.id })
            .update({
                title: data.title,
                body: data.body,
                status: data.status,
                slug: data.slug,
                featureImage: data.featureImage
            });
        
        Log.write(`Updated post where ID = ${+data.id}`, this.remoteIP);
        this.response.send({ redirect: `/blog/${+data.id}` });
    }

    @get("/blog/:id/:slug?")
    @view("post")
    async item(id, slug?) {
        const post = await this.store.posts
            .filter({ id: +id })
            .single<PostModel>();
        
        if (post.status !== "publish")
        {
            this.response.redirect("/blog");
            return; //todo: handle redirection via a return as with true ASP.NET MVC
        }

        const appendSlug = (slug == null) && post.slug || null;
        return new PostPresenter("read", post, appendSlug, this.isAdmin);
    }

    private getPagingInfo(page: number) {
        const olderPageUrl = "/blog/page/" + (page + 1);
        let newerPageUrl = "/blog/page/" + (page - 1);

        if (page - 1 === -1)
            newerPageUrl = null;

        if (page - 1 === 0)
            newerPageUrl = "/blog";

        return {
            olderPageUrl: olderPageUrl,
            newerPageUrl: newerPageUrl
        }
    }
}