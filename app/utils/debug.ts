
export default class Debug {

    static dump(target, key?) {
        const json = JSON.stringify(target, null, 4);

        if (key != null)
            console.log(key + ": " + json);
        else
            console.log(json);
    }
    
}