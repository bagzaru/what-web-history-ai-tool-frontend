async function logoutHandler(){
    const token = await getToken();
    const defaultHeader = {
        "Accept": "*/*",
        "Authorization": `Bearer ${token}`,
    };
    const url = "https://capstonepractice.site/api/auth/logout";
    const options = {
        method: "POST",
        headers: {
            ...defaultHeader,
        },
    };
    fetch(url, options)
    .then((response) => {
        console.log("response", response);
        if (response.status === 200){
            chrome.storage.local.remove("jwtToken", () => {
                if (chrome.runtime.lastError) {
                    console.error("토큰 삭제 오류:", chrome.runtime.lastError);
                } else {
                    console.log("JWT 토큰이 삭제되었습니다.");
                }
            });
        }
    })
    .catch((e) => console.log("error:", e));
}

function getToken() {
    return new Promise((resolve, reject) => {
        chrome.storage.local.get("jwtToken", (result) => {
            if (chrome.runtime.lastError) {
                reject(chrome.runtime.lastError);
            } else {
                resolve(result.jwtToken); //return token
            }
        });
    });
}

export { logoutHandler };