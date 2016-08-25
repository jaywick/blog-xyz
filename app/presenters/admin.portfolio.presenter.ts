import ProjectModel from "../models/project.model";

class AdminPortfolioProjectPresenter {
    key; subtitle; title; tags; status; score; isDraft; isPublished;

    constructor(project: ProjectModel) {
        this.key = project.key,
        this.subtitle = project.subtitle,
        this.title = project.title,
        this.tags = project.tags,
        this.status = project.status,
        this.score = project.score,
        this.isDraft = project.status === "draft",
        this.isPublished = project.status === "publish"
    }
}

export default class AdminPortfolioPresenter {
    projects: AdminPortfolioProjectPresenter[];

    constructor(projects: ProjectModel[]) {
        this.projects = projects.map(x => new AdminPortfolioProjectPresenter(x));
    }
}