const defaultHost = "seokjin.url";

function getURLfromPath(path) {
    const url = /^https?:\/\//.test(path)
        ? path
        : `https://${defaultHost}/${path}`;
    return url;
}

async function post(path, body, headers = {}) {
    const url = getURLfromPath(path);
    const options = {
        method: "POST",
        headers: {
            "Content-Type": "application/json",
            "Accept": "*/*",
            ...headers
        },
        body: JSON.stringify(body)
    };

    const response = await fetch(url, options);
    const data = await response.json();

    if (response.ok) {
        return data;
    }
    else {
        throw new Error(`HTTP error! status: ${response.status}`);
    }
}
async function put(path, body, headers = {}) {
    const url = getURLfromPath(path);
    const options = {
        method: "PUT",
        headers: {
            "Content-Type": "application/json",
            "Accept": "*/*",
            ...headers
        },
        body: JSON.stringify(body)
    };

    const response = await fetch(url, options);
    const data = await response.json();

    if (response.ok) {
        return data;
    }
    else {
        throw new Error(`HTTP error! status: ${response.status}`);
    }
}


export { post, put };