import {Promise} from "es6-promise";
import * as fs from "fs";
import * as path from "path";

import Router from "./router";
import LoginController from "./controllers/login.controller";
import PortfolioController from "./controllers/portfolio.controller";
import HomeController from "./controllers/home.controller";
import BlogController from "./controllers/blog.controller";
import StaticController from "./controllers/static.controller";
import AdminController from "./controllers/admin.controller";
import "reflect-metadata";
import Log from "./utils/log";
import Regex from "./utils/regex";
import Redirect from "./redirect";

export default class App {
    private app; uploader;

    start() {
        const express = require("express");
        const bodyParser = require("body-parser");
        const session = require('express-session');
        const http = require("http");
        const hbs = require("hbs");
        const multer = require('multer')
        this.extendHbs(hbs);

        this.app = express();
        this.app.engine("html", hbs.__express);
        this.app.set("view engine", "hbs");
        this.app.set("views", `${__dirname}/views`);
        this.app.use(express.static("res"));
        this.app.use(bodyParser.json());
        this.app.use(bodyParser.urlencoded({ extended: true }));
        this.app.use("/media", express.static("media"));
        this.app.use(session({
            secret: 'YOUR-SESSION-SECRET-HERE',
            maxAge: 24 * 60 * 60 * 1000, // 24 hours of log in time
            resave: true,
            rolling: true, // roll maxAge via remember me functionality
            saveUninitialized: true
        }));

        this.registerRoutes();

        const port = +(process.argv.mapFirst(x => x.extract(/--port=(\d+)/i)) || 80);
        http.createServer(this.app).listen(port);
    }

    private registerRoutes() {
        const router = new Router(this.app, [
            HomeController,
            BlogController,
            PortfolioController,
            AdminController,
            LoginController,
            StaticController
        ]);

        this.customRedirects(router);
        router.catchAll();
    }

    private customRedirects(router: Router) {
        router.redirect("/redirect", query => {
            const newPath = Redirect.resolve(<string>query.goto);

            if (newPath ===  "/")
                Log.warn(`Unexpected route: '${newPath}'. Redirecting to /`);

            return newPath;
        });
    }

    private extendHbs(handlebars) {
        this.registerPartials(handlebars, ["footer", "metalinks", "smallheader"]);
        this.registerGlobals(handlebars);

        handlebars.registerHelper("json", function (context) {
            return JSON.stringify(context);
        });

        // switch case thanks to http://chrismontrois.net/2016/01/30/handlebars-switch/
        handlebars.registerHelper("switch", function (value, options) {
            this._switch_value_ = value;
            var html = options.fn(this); // Process the body of the switch block
            delete this._switch_value_;
            return html;
        });

        handlebars.registerHelper("case", function () {
            // Convert "arguments" to a real array - stackoverflow.com/a/4775938
            var args = Array.prototype.slice.call(arguments);

            var options = args.pop();
            var caseValues = args;

            if (caseValues.indexOf(this._switch_value_) === -1) {
                return '';
            } else {
                return options.fn(this);
            }
        });

        handlebars.registerHelper("any", function (value, options) { 
            if (value === 0) 
                return options.inverse(this); 
 
            return options.fn(this); 
        }); 
 
        handlebars.registerHelper("plural", function (value, options) { 
            if (value === 1) 
                return ""; 
            
            else return "s"; 
        }); 
    }

    private registerPartials(handlebars, templates: string[]) {
        templates.forEach(x => {
            handlebars.registerPartial(x, fs.readFileSync(path.join(__dirname, `views/partials/${x}.hbs`), "utf8"));
        });
    }

    private registerGlobals(handlebars) {
        handlebars.registerHelper("YEAR", () => new Date().getFullYear());
    }
}