import "./extensions";

export default class Redirect {
    static resolve(link: string) {
        if (link == null || link === "" || link === "/")
            return "/";

        if ((/^\/?(?:labs?|portfolios?|projects?)\/?$/i).test(link))
            return "/portfolio"

        if ((/^\/?blog\/?$/i).test(link))
            return "/blog"

        if ((/^\/?about\/?$/i).test(link))
            return "/about"

        const projectExtract = link.extract(/^\/?(?:labs?|portfolios?|projects?)\/([^\/]+)\/?$/i);
        if (projectExtract) return `/portfolio/${projectExtract}`;

        const postExtract = link.extract(/^\/?(?:blog\/?)?(\d+)(?:\/[a-z-]+)?\/?$/i);
        if (postExtract) return `/blog/${postExtract}`;

        return "/";
    }
}