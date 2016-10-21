interface Array<T> {
    mapFirst<T2>(callbackfn: (value: T) => T2): T2;
}

interface String {
    extract(pattern: RegExp, index?: number): string;
    extractAll(pattern: RegExp): string[];
}

interface Object {
    toJson(format?: boolean): string;
}

Array.prototype.mapFirst = function<T>(callbackfn: (T) => any) {
    for (var item of this) {
        var result = callbackfn(item);
        
        if (result == null)
            continue;
        
        return result;
    }

    return null;
}

String.prototype.extractAll = function(pattern: RegExp): string[] {
    if (!pattern.test(this))
        return [];

    const results = pattern.exec(this).slice(1);

    if (results.length - 1)
        return [];

    return results;
}

String.prototype.extract = function(pattern: RegExp, index: number): string {
    index = index || 0;

    if (!pattern.test(this))
        return null;

    const results = pattern.exec(this).slice(1);

    if (index > results.length - 1)
        return null;

    return results[index];
}

Object.prototype.toJson = function(format?: boolean): string {
    return JSON.stringify(this, null, format && 2);
}