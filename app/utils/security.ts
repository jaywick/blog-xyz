import * as bcrypt from "bcrypt-nodejs";
import Log from "../utils/log";

export default class Security {
    private localSalt = "YOUR-APP-SALT-HERE";

    async hash(raw: string, salt: string) {
        return new Promise((resolve, reject) => {
            let hash = null;
            
            try {
                hash = bcrypt.hashSync(raw, salt + this.localSalt);
            } catch (err) {
                Log.warn("Failure at Security.hash: " + JSON.stringify(err));
                reject(err);
                return;
            }

            resolve(hash);
        });
    }
}