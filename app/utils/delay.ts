import {Promise} from "es6-promise";

export default function delay(millsecondsDelay: number): Promise<any> {
    return new Promise((resolve, reject) => {
        setTimeout(() => resolve(), millsecondsDelay);
    });
}