import LogModel from "../models/log.model";
const moment = require("moment");

export default class AdminLogsPresenter {
    logs;

    constructor(logs: LogModel[]) {
        this.logs = logs.map(x => {
            x["localTime"] = moment(x.time).format("YYYY/MM/DD HH:mm:DD")
            return x;
        });
    }
}