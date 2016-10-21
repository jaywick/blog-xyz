import CommentModel from "../models/comment.model";
import * as moment from "moment";
import * as markdown from "marked";

export default class CommentPresenter {
    _id;
    date: Date;
    author: string;
    text: string;

    cssClass: string;
    relativeDate: string;
    humanizedDate: string;

    constructor(model: CommentModel, public isAdmin: boolean) {
        this._id = model._id;
        this.date = model.date;
        this.author = model.author;
        this.text = markdown(model.text);
        this.cssClass = !model.isModerated && "pending";
        
        this.relativeDate = moment(this.date).fromNow();
        this.humanizedDate = moment(this.date).format("MMMM D, YYYY");
    }
}