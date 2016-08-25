import ProjectModel from "../models/project.model";
const markdown = require("marked");

export default class ProjectPresenter {
    mode: "read" | "update" | "create";
    key: string;
    title: string;
    subtitle: string;
    score: number;
    body: string;
    tags: string[];
    bodyHtml: string;
    featureImage: string;
    featureImageUrl: string;
    isAdmin: boolean;
    status: "published" | "draft";
    isDraft: boolean;
    isPublished: boolean;

    constructor(mode: "read" | "update" | "create", data?: ProjectModel, isAdmin?) {
        this.mode = mode;
        this.isAdmin = !!isAdmin;

        if (mode === "create") {
            data = new ProjectModel();
            data.body = "";
            data.featureImage = "";
            data.key = "";
            data.score = 0;
            data.subtitle = "";
            data.tags = [];
            data.title = "";
            data.status = "draft";
        }

        this.key = data.key;
        this.title = data.title;
        this.subtitle = data.subtitle;
        this.status = data.status as ("published" | "draft");
        this.score = +(data.score || 0);
        this.body = data.body;
        this.tags = data.tags;
        this.featureImage = data.featureImage;
        this.featureImageUrl = `/media/${data.key}/${data.featureImage}`;
        this.bodyHtml = this.getBodyHtml();
        this.isDraft = data.status === "draft";
        this.isPublished = data.status === "publish";
    }

    getBodyHtml() {
        return markdown(this.body);
    }
}