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
        // 로그인 요청
        const login_response = await fetch('https://capstonepractice.site/api/auth/oauth2/google', {
            method: 'POST',
            headers: {
                "Content-Type": "application/json",
            },
            body: JSON.stringify({ token: idToken }),
        });
        if (!login_response.ok) {
            throw new Error(`Server responded with status: ${login_response.status}`);
        }
        const tokens = await login_response.text();
        const jsonTokens = JSON.parse(tokens);
        console.log("jwtToken:", tokens);
        await storeToken(jsonTokens.accessToken, jsonTokens.refreshToken);

        // 유저 정보 가져오기
        const info_response = await fetch('https://www.googleapis.com/oauth2/v3/userinfo', {
            method: 'GET',
            headers: {
                'Authorization': `Bearer ${idToken}`,
            },
        });
        if (!info_response.ok){
            throw new Error(`Server responded with status: ${info_response.status}`);
        }
        const info = await info_response.json();
        console.log('User Info:', info);
        const email = info.email;
        const profilePicture = info.picture;
        await storeUserInfo(email, profilePicture);
        return true;
    } catch (error) {
        console.error("Error in loginHandler", error);
        return false;
    }
}

//chrome.storage.local.set 은 비동기로 처리됨
// new Promise 로 감싸서 loginhandler에서 token 저장을 await하게 할 수 있게 함.
function storeToken(accessToken, refreshToken) {
    return new Promise((resolve, reject) => {
        chrome.storage.sync.set(
            { 
                jwtToken: accessToken,
                refreshToken: refreshToken
             }, () => {
            if (chrome.runtime.lastError) {
                reject (new Error(chrome.runtime.lastError));
            } else {
                resolve();
            }
        });
    });
}

//로그인한 User의 UserInfo를 가져와 localstorage에 저장하는 함수
// Promise를 사용해 동기식으로 구현
function storeUserInfo(email, picture) {
    return new Promise((resolve, reject) => {
        chrome.storage.sync.set(
            { 
                user_email: email,
                user_picture: picture
            }, 
            () => {
                if (chrome.runtime.lastError) {
                    reject (new Error(chrome.runtime.lastError));
                } else {
                    resolve();
                }
            }
        );
    });
}

function getToken() {
    return new Promise((resolve, reject) => {
        chrome.storage.sync.get(["jwtToken", "refreshToken"], (result) => {
            if (chrome.runtime.lastError) {
                reject(chrome.runtime.lastError);
            } else {
                resolve(result); //return token
            }
        });
    });
}

async function tokenRefreshHandler() {
    try {
        const tokens = await getToken();
        const accessToken = tokens.jwtToken;
        const refreshToken = tokens.refreshToken;
        const defaultHeader = {
            "Accept": "*/*",
            "Authorization": `Bearer ${refreshToken}`,
            "Content-Type": "application/json",
        };
        const url = "https://capstonepractice.site/api/auth/refresh";
        const options = {
            method: "POST",
            headers: {
                ...defaultHeader,
            },
            body: JSON.stringify(
                { 
                    "accessToken": accessToken,
                    "refreshToken": refreshToken
                }),
        };
        const response = await fetch(url, options);
        if (!response.ok) {
            if (response.status === 401){
                console.log("refreshToken 만료됨");
                await deleteToken();
                chrome.notifications.create({
                    type: "basic",
                    iconUrl: "../icon.png",
                    title: "로그인 세션 만료",
                    message: "로그인 세션이 만료되어 자동으로 로그아웃 됩니다.\n다시 로그인해주세요."
                });
                return true;
            } else {
                throw new Error(`Server responded with status: ${response.status}`);
            }
        }
        const newToken = await response.text();
        console.log("refresh response data", newToken);
        await storeToken(newToken, refreshToken);
        return true;
    } catch (error) {
        console.error("Error in tokenRefreshHandler", error);
        return false;
    }
}

// 저장된 토큰 삭제를 동기식으로 처리하기 위한 함수
function deleteToken() {
    return new Promise((resolve, reject) => {
        chrome.storage.sync.remove(['jwtToken','refreshToken','user_email', 'user_picture'], () => {
            if (chrome.runtime.lastError) {
                reject(new Error(chrome.runtime.lastError));
            } else {
                console.log("jwt 토큰 및 사용자 정보 삭제 성공");
                resolve();
            }
        });
    });
}

export { loginHandler, tokenRefreshHandler };