import Store from "../store";
import QueryOtions from "../utils/query.options";

abstract class ControllerBase {
    public request;
    public response;

    constructor(protected store: Store) {
    }

    get isAdmin(): boolean {
        if (!this.request || !this.request.session || !this.request.session.user)
            return false;

        return this.request.session.isAdmin === true;
    }

    get remoteIP(): string {
        return this.request && (this.request.headers["x-forwarded-for"] || this.request.connection.remoteAddress);
    }

    get options(): QueryOtions {
        return new QueryOtions(this.request);
    }
}

export default ControllerBase;