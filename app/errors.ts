export class NotFoundError extends Error {
    constructor(public url?: string) {
        super('404 Not Found ' + url)
    }
}

export class RedirectError extends Error {
    constructor(public url: string, public originalUrl: string) {
        super(`301 Moved Permanently - ${originalUrl} => ${url}`)
    }
}

export class ForbiddenError extends Error {
    constructor(public url?: string) {
        super('403 Forbidden ' + url)
    }
}

export class PostError extends Error {
    constructor(public body: {}) {
        super('Post error ' + body['message'])
    }
}
