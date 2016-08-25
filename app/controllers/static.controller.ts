import Store from "../store";
import PostModel from "../models/post.model";
import PostPresenter from "../presenters/post.presenter";
import {get, post, view, restricted} from "../router";
import ControllerBase from "./controller.base";

export default class BlogController extends ControllerBase {

    constructor(store: Store, request, response) {
        super(store);
    }

    @get("/about")
    @view("about")
    about() {
    }

}