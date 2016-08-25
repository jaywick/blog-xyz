import Store from "../store";
import LogModel from "../models/log.model";

export default class Log {
    static store: Store;

    constructor() {
    }

    static initialise() {
        Log.store = new Store();
    }

    static write(message: string, ip?, severity?: "log" | "warn" | "fail") {
        if (!Log.store)
        {
            console.error(`Failed to log error. ${message}`);
            return;
        }

        const entry = new LogModel();
        entry.message = message;
        entry.severity = severity || "log";
        entry.time = Date().toString();
        entry.ip = ip;
        Log.store.logs.insert(entry);
    }

    static warn(message: string, ip?) {
        Log.write(message, ip, "warn")
    }

    static fail(message: string, ip?) {
        Log.write(message, ip, "log");
    }
}