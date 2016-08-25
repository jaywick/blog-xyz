export default class AdminModel {
    static collection: string = "admin";

    user: string;
    passHash: string;
    salt: string;
    lastLoggedIn: string;
}