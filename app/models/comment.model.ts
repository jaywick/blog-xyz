export default class CommentModel {
    static collection: string = "comments";

    _id;
    postID: number;
    date: Date;
    author: string;
    text: string;
    ip: string;
    isModerated: boolean;
}