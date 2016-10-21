import PostPresenter from "./post.presenter";
import PostModel from "../models/post.model";
import * as moment from "moment";

class AdminBlogPostPresenter {
    id; slug; title; date; status; notCompliant; isDraft; isPublished;

    constructor(post: PostModel) {
        this.id = post.id,
        this.slug = post.slug,
        this.title = post.title,
        this.date = post.date && moment(post.date).format("DD/MM/YYYY") || "",
        this.status = post.status.toString(),
        this.notCompliant = !AdminBlogPresenter.checkCompliance(post),
        this.isDraft = post.status === "draft",
        this.isPublished = post.status === "publish"
    }
}

export default class AdminBlogPresenter {
    posts: AdminBlogPostPresenter[];
    filterStatusNone: boolean;
    filterStatusDraft: boolean;
    filterStatusPublished: boolean;

    constructor(posts: PostModel[], statusFilter?: string) {
        statusFilter = statusFilter || "all";
        this.posts = posts.map(x => new AdminBlogPostPresenter(x)),
        this.filterStatusNone = statusFilter === "all",
        this.filterStatusDraft = statusFilter === "draft",
        this.filterStatusPublished = statusFilter === "publish"
    }

    static checkCompliance(post: PostModel) {
        // no references to .io site
        if (post.body.indexOf("jaywick.io") > -1)
            return false;
        
        // no references to .com site
        if (post.body.indexOf("jay-wick.com") > -1)
            return false;
        
        // require summary splitter
        if (post.body.indexOf("****") === -1)
            return false;
        
        if (post.date == null)
            return false;

        if (post.id == null)
            return false;

        if (!post.title || !post.body || !post.slug)
            return false;

        if (post.status !== "draft" && post.status !== "publish")
            return false;

        return true;
    }
}