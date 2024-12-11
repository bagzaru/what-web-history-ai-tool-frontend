async function post(path, body, headers = {}) {
    const token = await getToken();

    const defaultHeader = {
        "Content-Type": "application/json",
        "Accept": "*/*",
        "Authorization": `Bearer ${token}`,
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

    if (response.ok) {
        // 응답에 body가 있는지 체크 후 적절한 결과를 반환
        const readableData = await response.text();
        if(readableData){
            const data = JSON.parse(readableData);
            return data;
        } else {
            return true;
        }
    }
    else {
        const data = await response.json();
        throw new Error(`HTTP error! status: ${response.status}, ${data.message}`);
    }
}
async function put(path, body = {}, headers = {}) {
    const token = await getToken();

    const defaultHeader = {
        "Content-Type": "application/json",
        "Accept": "*/*",
        "Authorization": `Bearer ${token}`,
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

    if (response.ok) {
        // 응답에 body가 있는지 체크 후 적절한 결과를 반환
        const readableData = await response.text();
        console.log('check readableData', readableData);
        if(readableData){
            const data = JSON.parse(readableData);
            return data;
        } else {
            return true;
        }
    }
    else {
        const data = await response.json();
        throw new Error(`HTTP error! status: ${response.status}, ${data.message}`);
    }
}

async function get(path, headers = {}) {
    const token = await getToken();

    const defaultHeader = {
        "Content-Type": "application/json",
        "Accept": "*/*",
        "Authorization": `Bearer ${token}`,
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

async function del(path, headers = {}) {
    const token = await getToken();

    const defaultHeader = {
        "Content-Type": "application/json",
        "Accept": "*/*",
        "Authorization": `Bearer ${token}`,
    };
    const url = path;
    const options = {
        method: "DELETE",
        headers: {
            ...defaultHeader,
            ...headers
        }
    };

    const response = await fetch(url, options);

    if (response.ok) {
        console.log('del response ok');
        return true;
    }
    else {
        const data = await response.json();
        throw new Error(`HTTP error! status: ${response.status}, ${data.message}`);
    }
}

function getToken() {
    return new Promise((resolve, reject) => {
        chrome.storage.sync.get("jwtToken", (result) => {
            if (chrome.runtime.lastError) {
                reject(chrome.runtime.lastError);
            } else {
                resolve(result.jwtToken); //return token
            }
        });
    });
}

export { post, put, get, del };