export default class ProjectModel {
    static collection: string = "projects";

    key: string;
    title: string;
    score: number;
    subtitle: string;
    body: string;
    tags: string[];
    featureImage: string;
    status: string;
}