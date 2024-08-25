import {getAPIKey} from "./store";

export const makePostRequest = (url: string, body: any) => {
    return new Promise((resolve, reject) => {
        fetch(url, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
                'Authorization': getAPIKey()
            },
            body: JSON.stringify(body),
        })
            .then(response => response.json())
            .then(data => {
                resolve(data)
            })
            .catch(error => {
                console.error('Error:', error);
                reject(error);
            });
    })
}

export const makeGetRequest = (url: string, queryParams: Record<string, string>): Promise<any> => {
    // Construct query parameters string
    const queryString = new URLSearchParams(queryParams).toString();
    // Append query parameters to the URL if any
    const fullUrl = queryString ? `${url}?${queryString}` : url;

    return new Promise((resolve, reject) => {
        fetch(fullUrl, {
            method: 'GET',
            headers: {
                'Content-Type': 'application/json',
                'Authorization': getAPIKey()
            },
        })
            .then(response => {
                if (!response.ok) {
                    throw new Error('Network response was not ok');
                }
                return response.json();
            })
            .then(data => {
                resolve(data);
            })
            .catch(error => {
                console.error('Error:', error);
                reject(error);
            });
    });
};
