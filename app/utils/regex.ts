
export default class Regex {

    static fromGlob(glob: string) {
        const pattern = glob
            .replace(".", "\.")
            .replace("*", ".*")
            .replace("#", "\d")
            .replace("?", ".");
        
        return new RegExp(pattern, "i");
    }
}