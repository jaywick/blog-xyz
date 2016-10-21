import {Promise} from "es6-promise";
import reflect from "./utils/reflect";
import Store from "./store";
import Log from "./utils/log";
import ControllerBase from "./controllers/controller.base";
import delay from "./utils/delay";
import "reflect-metadata";
const multer = require("multer");

export default class Router {
    private uploader;

    private hostsWhitelist = [ "YOUR-DOMAIN-HERE.com", "localhost", "127.0.0.1", "::1" ];

    constructor(private app, private controllerClasses: any[]) {
        this.uploader = multer({ dest: "media/temp/" });

        this.app.use((req, res, next) => {
            res.header("Content-Type", "text/html");
            next();
        });

        const store = new Store();
        controllerClasses.forEach(controllerClass => {
            const controller = new controllerClass(store);
            this.register(controller);
        });
    }

    register(controller) {
        var methods = reflect(controller).methods;

        methods.forEach(method => {
            var isRestricted = <boolean>Reflect.getMetadata("admin.restricted", controller, method) || false;

            var getPath: any = Reflect.getMetadata("get.path", controller, method);
            var getView: any = Reflect.getMetadata("get.view", controller, method);
            var postPath: any = Reflect.getMetadata("post.path", controller, method);
            var uploadPath: any = Reflect.getMetadata("upload.path", controller, method);

            if (getPath)
                this.registerGet(getPath, getView, isRestricted, (arg1, arg2, arg3, arg4, arg5) => controller[method](arg1, arg2, arg3, arg4, arg5), controller);

            else if (postPath)
                this.registerPost(postPath, isRestricted, (data) => controller[method](data), controller);

            else if (uploadPath)
                this.registerUpload(uploadPath, isRestricted, (data) => controller[method](data), controller);
        });
    }

    private registerGet(path: string, view: string, isRestricted?: boolean, method?: (...args) => any | Promise<any>, controller?: ControllerBase): Router {
        this.app.get(path, (request, response) => {
            let args = reflect(request.params).properties.map(x => x.value);

            if (!this.isWhitelisted(request)) {
                delay(10000).then(() => response.status(403).send());
            } else if (isRestricted && request.session.isAdmin !== true) {
                response.redirect(`/login?redirect=${encodeURIComponent(request.url)}`);
            } else {
                Log.stat("GET " + request.url + " with args " + JSON.stringify(request.params), request.ip);

                if (controller) {
                    controller.response = response;
                    controller.request = request;
                }

                Promise.resolve((method == null) ? () => { } : method.call(this, ...args))
                    .then((result) => {
                        if (view == null) {
                            // return JSON
                            response.json(result);
                            return;
                        }

                        response.render(view, result);
                    })
                    .catch(ex => {
                        console.error(ex);

                        if (ex.message.indexOf("Cannot connect to database! connect ECONNREFUSED") > -1) {
                            this.respond503(controller, ex);
                            return;
                        }

                        this.respond500(controller, ex);
                    });
            }
        });

        return this;
    }

    private registerPost(path: string, isRestricted?: boolean, method?: (data: {}, request?, response?) => string | Promise<string>, controller?: ControllerBase): Router {
        this.app.post(path, (request, response) => {
            const data = request.body;

            if (isRestricted && request.session.isAdmin !== true) {
                response.status(404).render("errors/404");
            } else {
                Log.stat("POST " + request.url, request.ip);

                if (controller) {
                    controller.response = response;
                    controller.request = request;
                }

                Promise.resolve((method == null) ? () => { } : method.call(this, data, request, response))
                    .catch(ex => {
                        console.error(ex);
                        this.respond500(controller, ex);
                    });
            }
        });

        return this;
    }

    private registerUpload(path: string, isRestricted?: boolean, method?: (request?, response?) => string | Promise<string>, controller?: ControllerBase): Router {
        this.app.post(path, this.uploader.any(), (request, response) => {
            const file = request.files[0];

            if (isRestricted && request.session.isAdmin !== true) {
                response.status(404).render("errors/404");
            } else {
                Log.stat(`UPLOAD ${request.url} file ${file}`, request.ip);

                if (controller) {
                    controller.response = response;
                    controller.request = request;
                }

                response.send({ "tempPath": '/' + file.path.replace(/\\/g, "/") });

                Promise.resolve((method == null) ? () => { } : method.call(this, request, response))
                    .catch(ex => {
                        console.error(ex);
                        this.respond500(controller, ex);
                    });
            }
        });

        return this;
    }

    redirect(path: string, destination: (string) => string) {
        this.app.get(path, (request, response) => {
            const destinationValue = destination(request.query);
            Log.stat("Redirecting " + request.url + " to " + destinationValue, request.ip);
            response.redirect(destinationValue);
        });

        return this;
    }

    catchAll() {
        this.app.get("*", (request, response) => {
            if (!this.isWhitelisted(request)) {
                delay(10000).then(() => response.status(403).send());
                return;
            }

            Log.stat(`404 not found for url: '${request.url}', args: '${request.params.toJson()}', host: '${request.hostname}', path: '${request.originalUrl}'`, request.ip);
            response.status("404").render("errors/404");
        });
    }

    private respond500(controller: ControllerBase, ex) {
        Log.stat(`500 Internal Server Error for GET ${controller.request.query}. Error = ${JSON.stringify(ex)}`, controller.remoteIP);
        controller.response
            .status(500)
            .render("errors/500", {
                isAdmin: controller.isAdmin,
                message: ex.message,
                stack: ex.stack
            });
    }

    private respond503(controller: ControllerBase, ex) {
        controller.response
            .status(503)
            .render("errors/503", {
                isAdmin: controller.isAdmin,
                message: ex.message,
                stack: ex.stack
            });
    }

    private isWhitelisted(request): boolean {
        return this.hostsWhitelist.some(x => x === request.hostname);
    }
}

export function get(path: string) {
    return (target: Object, propertyKey: string, descriptor: TypedPropertyDescriptor<any>) => {
        Reflect.defineMetadata("get.path", path, target, propertyKey);
        return descriptor;
    };
}

export function view(view: string) {
    return (target: Object, propertyKey: string, descriptor: TypedPropertyDescriptor<any>) => {
        Reflect.defineMetadata("get.view", view, target, propertyKey);
        return descriptor;
    };
}

export function post(path: string) {
    return (target: Object, propertyKey: string, descriptor: TypedPropertyDescriptor<any>) => {
        Reflect.defineMetadata("post.path", path, target, propertyKey);
        return descriptor;
    };
}

export function restricted() {
    return (target: Object, propertyKey: string, descriptor: TypedPropertyDescriptor<any>) => {
        Reflect.defineMetadata("admin.restricted", true, target, propertyKey);
        return descriptor;
    };
}

export function upload(path: string) {
    return (target: Object, propertyKey: string, descriptor: TypedPropertyDescriptor<any>) => {
        Reflect.defineMetadata("upload.path", path, target, propertyKey);
        return descriptor;
    };
}
