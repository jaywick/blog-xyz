
export default function reflect(target) {
    return new TypeInfo(target);
}

export class TypeInfo {

    constructor(private target: Object) {
    }

    get methods(): string[] {
        let methods = [],
            props = [],
            obj = this.target;
        
        do {
            props = props.concat(Object.getOwnPropertyNames(obj));
        } while (obj = Object.getPrototypeOf(obj));

        return props
            .filter(x => x !== "arguments" && x !== "caller") // ignore internals
            .filter(x => typeof this.target[x] === "function");
    }

    get properties(): { name; value }[] {
        let properties = [];

        for (let property in this.target) {
            if (typeof this.target[property] == "function")
                continue;

            let value = this.target[property];
            properties.push({ name: property, value: value });
        }

        return properties;
    }
}