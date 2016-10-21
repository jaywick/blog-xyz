import Store from "../store";
import {get, post, view} from "../router";
import Debug from "../utils/debug";
import ControllerBase from "./controller.base";
import AdminModel from "../models/admin.model";
import Security from "../utils/security";
import Log from "../utils/log";

export default class LoginController extends ControllerBase {

    constructor(store: Store, request, response) {
        super(store);
    }

    @get("/login")
    @view("login")
    login() {
        this.request.session.user = "";
        this.request.session.isAdmin = false;

        return { redirect: this.request.query.redirect };
    }

    @get("/logout")
    logout() {
        this.request.session.user = "";
        this.request.session.isAdmin = false;
        this.response.redirect("/");
    }

    @post("/login/authenticate")
    async authenticate(data: { username; passphrase; redirect }) {
        try {
            const admin = await this.store.admin
                .single<AdminModel>();

            const hash = await new Security().hash(data.passphrase, admin.salt);
            
            if (data.username !== admin.user || admin.passHash !== hash) {
                // force destroy session
                this.request.session.user = null;
                this.request.session.isAdmin = false;

                // log attempt
                Log.warn(`Failed attempt to login. Username: ${data.username}`, this.remoteIP);
                return;
            }

            // init session
            this.request.session.user = admin.user;
            this.request.session.isAdmin = true;

            // save last logged in date
            await this.store.admin
                .filter({ user: admin.user })
                .update({ lastLoggedIn: new Date() });

            this.response.send({ redirect: data.redirect || "/" });
        } catch (err) {
            Log.fail(`Unexpected error in LoginController.authenticate() where username was ${data.username}`, this.remoteIP);
            this.response.send({ redirect: "/" });
        }
    }
}