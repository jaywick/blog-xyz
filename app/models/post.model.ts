export default class PostModel {
    static collection: string = "posts";

    id: number;
    title: string;
    body: string;
    date: Date;
    slug: string;
    tags: string[];
    featureImage: string;
    originalUrl: string;
    status: string;
}