export default class AdminModel {
    static collection: string = "admin";

    user: string;
    passHash: string;
    salt: string;
    lastLoggedIn: Date;
    lastCommentsRead: Date;
}