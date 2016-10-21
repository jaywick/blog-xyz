import PostModel from "../models/post.model";
import NameGenerator from "../utils/name.generator";
import * as moment from "moment";
import Markdown from "../utils/markdown";

export default class PostPresenter {
    static SUMMARY_CHAR_LIMIT = 350;

    mode: "create" | "update" | "read";
    id: number;
    title: string;
    body: string;
    date: Date;
    slug: string;
    tags: string[];
    featureImage: string;
    featureImageUrl: string;
    originalUrl: string;
    status: "published" | "draft";
    bodyHtml: string;
    truncatedHtml: string;
    summary: string;
    humanizedDate: string;
    isAdmin: boolean;
    isDraft: boolean;
    isPublished: boolean;
    relativeDate: string;
    commentAuthor: string;
    readTime: number;
    commentCount: number;

    constructor(mode: "create" | "update" | "read", model?: PostModel, private appendSlug?: string, isAdmin?: boolean, ip?: string) {
        this.mode = mode;
        this.isAdmin = !!isAdmin;

        if (mode === "create" && !model) {
            model = {
                id: -1,
                title: "",
                body: "",
                date: moment().utc().toDate(),
                slug: "",
                tags: [],
                status: "draft",
                originalUrl: null,
                featureImage: null
            };
        }

        this.id = model.id;
        this.title = model.title;
        this.body = model.body;
        this.date = model.date;
        this.slug = model.slug;
        this.tags = model.tags;
        this.status = model.status as ("published" | "draft");
        this.originalUrl = model.originalUrl;
        this.featureImage = model.featureImage;
        this.featureImageUrl = model.featureImage && (`/media/${model.id}/${model.featureImage}`);
        this.bodyHtml = this.getBodyHtml();
        this.truncatedHtml = this.getTruncatedHtml();
        this.summary = this.getSummary();
        this.humanizedDate = this.getHumanizedDate();
        this.isDraft = model.status === "draft";
        this.isPublished = model.status === "publish";
        this.relativeDate = this.getRelativeDate();
        this.commentAuthor = "@" + NameGenerator.fromIP(ip);
        this.readTime = this.getReadTime();
        this.commentCount = model["commentCount"];
    }

    private getBodyHtml() {
        return Markdown.parse(this.body);
    }

    private getTruncatedHtml() {
        return Markdown.summarise(this.body);
    }

    private getSummary() {
        return Markdown.snippet(this.body);
    }

    private getHumanizedDate() {
        if (this.date == null) return null;
        return moment(this.date).format("MMMM D, YYYY");
    }

    private getRelativeDate() {
        if (this.date == null) return null;
        const date = moment(this.date);
        return date.format("MMM D, YYYY");
    }

    private getReadTime() {
        // based on https://blog.medium.com/read-time-and-you-bc2048ab620c#.vrd4kbc3f
        const readSpeed = 250; // wpm
        const imageSpeed = 5 / 60; // 5s per image
        const words = (this.body.match(/\S+/g) || []).length;
        const images = (this.body.match(/\!\[.+?\]\(.+?\)/g) || []).length;

        return Math.ceil(words / readSpeed + images * imageSpeed);
    }
}