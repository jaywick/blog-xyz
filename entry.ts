/// <reference path="./typings/index.d.ts"/>
require("./app/extensions");
import Log from "./app/utils/log";
Log.initialise();

import App from "./app/app";
const app = new App();
app.start();