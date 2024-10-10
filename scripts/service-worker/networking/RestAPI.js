const defaultHost = "seokjin.url";

const defaultHeader = {
    "Content-Type": "application/json",
    "Accept": "*/*",
};


async function post(path, body, headers = {}) {
    const url = path;
    const options = {
        method: "POST",
        headers: {
            ...defaultHeader,
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
    console.log("put: body: " + JSON.stringify(body));
    const url = path;
    const options = {
        method: "PUT",
        headers: {
            ...defaultHeader,
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
        throw new Error(`HTTP error! status: ${response.status}, ${data.message}`);
    }
}


export { post, put };