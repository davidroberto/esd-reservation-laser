export type fetchInterface = {
    (url: string, params: {
        method: string;
        headers: {
            [key: string]: string
        };
        body: string;
    }): Promise<{
        ok: boolean;
    }>;
}

export const fakeFetch: fetchInterface = (url: string, options: any): Promise<{
    ok: boolean
}> => {
    return new Promise((resolve) => {
        setTimeout(() => {
            resolve({ok: true});
        }, 1000);
    });
}

export const fetchApi : fetchInterface = (url: string, options: any): Promise<{
    ok: boolean
}> => {
    return fetch(url, options).then(response => {
        return {ok: response.ok};
    });
}