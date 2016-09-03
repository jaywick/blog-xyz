export default class LogModel {
    static collection: string = "logs";

    date: Date;
    ip: string;
    severity: string;
    message: string;
}