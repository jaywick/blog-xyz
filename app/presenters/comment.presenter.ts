import CommentModel from "../models/comment.model";
const moment = require("moment");

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
        this.text = model.text;
        this.cssClass = !model.isModerated && "pending";
        
        this.relativeDate = moment(this.date).fromNow();
        this.humanizedDate = moment(this.date).format("MMMM D, YYYY");
    }
}