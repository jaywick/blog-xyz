import Store from "../store";
import PostModel from "../models/post.model";
import CommentModel from "../models/comment.model";
import PostPresenter from "../presenters/post.presenter";
import CommentPresenter from "../presenters/comment.presenter";
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
            posts: posts.map(x => new PostPresenter("read", x, null, null, this.remoteIP)),
            isAdmin: this.isAdmin,
            paging: this.getPagingInfo(+page)
        };
    }

    @get("/blog/tag/:tag")
    @view("blog-tagged")
    async tagged(tag) {
        const posts = await this.store.posts
            .filter({ status: "publish", tags: tag })
            .orderByDesc("date")
            .toArray<PostModel>();

        return {
            posts: posts.map(x => new PostPresenter("read", x, null, null, this.remoteIP)),
            isAdmin: this.isAdmin,
            tag: tag
        };
    }

    @get("/blog/comments/:page")
    async comments(page) {
        const filter = { postID: +page };
        
        if (!this.isAdmin)
            filter["isModerated"] = true;
        
        const comments = await this.store.comments
            .filter(filter)
            .orderByDesc("date")
            .projectAll() // get back _id values
            .toArray<CommentModel>();
        
        return comments.map(x => new CommentPresenter(x, this.isAdmin));
    }

    @restricted()
    @get("/blog/add")
    @view("post")
    add() {
        return new PostPresenter("create", null, null, true, this.remoteIP);
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

    @post("/blog/save/comment")
    async saveComment(data) {
        const author = data.author.replace("@", "");

        await this.store.comments
            .insert({
                postID: +data.postID,
                text: data.text,
                ip: this.remoteIP,
                author: author,
                isModerated: false,
                date: new Date(),
            });
        
        Log.stat(`@${author} wrote a comment on post ${+data.postID}: ${data.text}`, this.remoteIP);

        this.response.send({});
    }

    @restricted()
    @post("/blog/save/approve-comment")
    async approveComment(data) {
        this.store.comments
            .filterId(data.id)
            .update({isModerated: data.state.toLowerCase() === "true"});
        
        this.response.send({});
    }

    @restricted()
    @get("/blog/edit/:id")
    @view("post")
    async edit(id) {
        const post = await this.store.posts
            .filter({ id: +id })
            .single<PostModel>();
        
        return new PostPresenter("update", post, null, this.isAdmin, this.remoteIP);
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
        return new PostPresenter("read", post, appendSlug, this.isAdmin, this.remoteIP);
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