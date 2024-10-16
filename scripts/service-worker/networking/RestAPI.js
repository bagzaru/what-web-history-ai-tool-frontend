async function post(path, body, headers = {}) {
    const defaultHeader = {
        "Content-Type": "application/json",
        "Accept": "*/*",
    };
    const url = path;
    const options = {
        method: "POST",
        headers: {
            ...defaultHeader,
            ...headers
        },
        body: body
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
    const defaultHeader = {
        "Accept": "*/*",
    };
    const url = path;
    const options = {
        method: "PUT",
        headers: {
            ...defaultHeader,
            ...headers
        },
        body: body
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

async function get(path, headers = {}) {
    const defaultHeader = {
        "Content-Type": "application/json",
        "Accept": "*/*",
    };
    const url = path;
    const options = {
        method: "GET",
        headers: {
            ...defaultHeader,
            ...headers
        }
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

export { post, put, get };