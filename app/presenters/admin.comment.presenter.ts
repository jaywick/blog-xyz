import CommentModel from "../models/comment.model";
import * as moment from "moment";

export default class AdminCommentPresenter {
    comments;

    constructor(comments: CommentModel[], posts: { id; title; status }[], lastRead: Date) {
        this.comments = comments.map(comment => {
            comment["id"] = comment._id;
            comment["localTime"] = moment(comment.date).format("YYYY/MM/DD HH:mm:ss")
            comment["post"] = posts.filter(x => x.id === comment.postID)[0];
            comment["isPending"] = !comment.isModerated;
            comment["isApproved"] = comment.isModerated;
            comment["isUnread"] = lastRead && moment(comment.date).isAfter(lastRead) || false;
            comment["isRead"] = !comment["isUnread"];

            return comment;
        });
    }
}