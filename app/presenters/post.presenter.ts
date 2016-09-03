import PostModel from "../models/post.model";
import NameGenerator from "../utils/name.generator";
const moment = require("moment");
const markdown = require("marked");

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
    }

    private getBodyHtml() {
        return markdown(this.body.replace(/^\*\*\*\*$/gim, "\n"));
    }

    private getTruncatedHtml() {
        const breakPosition = this.body.indexOf("****");

        if (breakPosition === -1)
            return this.bodyHtml;

        const truncated = this.body.substring(0, breakPosition);
        return markdown(truncated);
    }

    private getSummary() {
        const flatText = this.body
            .split("\n")
            .filter(x => x.indexOf("#") !== 0)    // filter out headings
            .filter(x => x.indexOf("-") !== 0)    // filter list items
            .filter(x => x.indexOf("    ") !== 0) // filter out code
            .filter(x => x.indexOf("```") !== 0)  // filter out code
            .filter(x => x.indexOf("- ") !== 0)   // filter out code
            .slice(0, 3).join(" ")                // merge first 3 paragraphs as sentences
            .split(". ").slice(0, 4).join(". ")   // get first 4 sentences
            .replace(/\[(.+?)\]\(.+?\)/gi, "$1")  // swap linked text with text
            .replace(/\!\[(.+?)\]\(.+?\)/gi, "")  // remove image syntax
            .replace(/`(.+?)`/gi, "<i>$1</i>");   // swap code with italics

        return flatText;
    }

    private getHumanizedDate() {
        return moment(this.date).format("MMMM D, YYYY");
    }

    private getRelativeDate() {
        const date = moment(this.date);
        return date.format("MMM D, YYYY");
    }
}