import { PostError } from "../errors";


export const post = <TPayload, TResponse>(url: string, payload: TPayload): Promise<TResponse> => {
    return fetch(url, {
        method: 'POST',
        body: JSON.stringify(payload),
        credentials: 'same-origin',
        headers: [
            ['Content-Type', 'application/json']
        ]
    }).then(response => response.json().then(json => [response.status, json]))
        .then(([status, data]) => {
            if (status !== 200)
                throw new PostError(data)
            else
                return data
        })
}
