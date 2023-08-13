export const makePostRequest = (url: string, body: any) => {
    return new Promise((resolve, reject) => {
        fetch(url, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
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
