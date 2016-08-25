import {Promise} from "es6-promise";
import reflect from "./utils/reflect";
import Store from "./store";
import Log from "./utils/log";
import ControllerBase from "./controllers/controller.base";
import "reflect-metadata";

export default class Router {

    constructor(private app, private controllerClasses: any[]) {
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

            if (getPath)
                this.get(getPath, getView, isRestricted, (arg1, arg2, arg3, arg4, arg5) => controller[method](arg1, arg2, arg3, arg4, arg5), controller);

            var postPath: any = Reflect.getMetadata("post.path", controller, method);

            if (postPath)
                this.post(postPath, isRestricted, (data) => controller[method](data), controller);
        });
    }

    private get(path: string, view: string, isRestricted?: boolean, method?: (...args) => any | Promise<any>, controller?: ControllerBase): Router {
        this.app.get(path, (request, response) => {
            let args = reflect(request.params).properties.map(x => x.value);

            if (isRestricted && request.session.isAdmin !== true) {
                response.redirect(`/login?redirect=${encodeURIComponent(request.url)}`);
            } else {
                if (controller) {
                    controller.response = response;
                    controller.request = request;
                }
                
                Promise.resolve((method == null) ? () => { } : method.call(this, ...args))
                    .then((result) => {
                        response.render(view, result);
                    })
                    .catch(ex => {
                        this.respond500(controller, ex);
                    });
            }
        });

        return this;
    }

    private post(path: string, isRestricted?: boolean, method?: (data: {}, request?, response?) => string | Promise<string>, controller?: ControllerBase): Router {
        this.app.post(path, (request, response) => {
            const data = request.body;

            if (isRestricted && request.session.isAdmin !== true) {
                response.status(404).render("404");
            } else {
                if (controller) {
                    controller.response = response;
                    controller.request = request;
                }

                Promise.resolve((method == null) ? () => { } : method.call(this, data, request, response))
                    .catch(ex => {
                        this.respond500(controller, ex);
                    });
            }
        });

        return this;
    }

    redirect(path: string, destination: (string) => string) {
        this.app.get(path, (request, response) => {
            response.redirect(destination(request.query));
        });

        return this;
    }

    catchAll() {
        this.app.get("*", (request, response) => response.status("404").render("404"));
    }

    private respond500(controller: ControllerBase, ex) {
        Log.fail(`500 Internal Server Error for GET ${controller.request.query}. Error = ${JSON.stringify(ex)}`, controller.remoteIP);
        controller.response
            .status(500)
            .render("500", {
                isAdmin: controller.isAdmin,
                message: ex.message,
                stack: ex.stack
            });
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
