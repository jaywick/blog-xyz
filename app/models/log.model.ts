export default class LogModel {
    static collection: string = "logs";

    time: string;
    ip: string;
    severity: string;
    message: string;
}