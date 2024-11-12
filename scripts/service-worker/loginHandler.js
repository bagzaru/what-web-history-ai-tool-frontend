// callback 대신 promise 사용
function googleLogin() {
    return new Promise((resolve, reject) => {
        const clientId = "304314144761-9gfb9l023pe0cpi5p9efn21uonp9nsfo.apps.googleusercontent.com";
        const redirectUri = chrome.identity.getRedirectURL();
        const authUrl = `https://accounts.google.com/o/oauth2/auth?client_id=${clientId}&response_type=token&redirect_uri=${redirectUri}&scope=profile%20email`;

        chrome.identity.launchWebAuthFlow(
            {
                url: authUrl,
                interactive: true,
            },
            (redirectUrl) => {
                if (chrome.runtime.lastError || !redirectUrl) {
                    console.error("Authentication failed:", chrome.runtime.lastError);
                    reject(chrome.runtime.lastError);
                    return;
                }
                // 인증 성공 시
                const idToken = new URL(redirectUrl).hash.match(/access_token=([^&]*)/)[1];
                console.log("Google OAuth Token:", idToken);
                resolve(idToken);
            }   
        )
    })
}

async function loginHandler() {
    try {
        const idToken = await googleLogin();
        console.log("loginHandler Active: ", idToken);
        const response = await fetch("https://capstonepractice.site/api/auth/oauth2/google", {
            method: "POST",
            headers: {
                "Content-Type": "application/json",
            },
            body: JSON.stringify({ token: idToken }),
        });
        if (!response.ok) {
            throw new Error(`Server responded with status: ${response.status}`);
        }
        
        const data = await response.text();
        const jwtToken = data;
        console.log("jwtToken:", jwtToken);
        await storeToken("jwtToken", jwtToken);
        return true;
    } catch (error) {
        console.error("Error in loginHandler", error);
        return false;
    }
}

//chrome.storage.local.set 은 비동기로 처리됨
// new Promise 로 감싸서 loginhandler에서 token 저장을 await하게 할 수 있게 함.
function storeToken(key, value) {
    return new Promise((resolve, reject) => {
        chrome.storage.local.set({ [key]: value }, () => {
            if (chrome.runtime.lastError) {
                reject (new Error(chrome.runtime.lastError));
            } else {
                resolve();
            }
        });
    });
}

export { loginHandler };