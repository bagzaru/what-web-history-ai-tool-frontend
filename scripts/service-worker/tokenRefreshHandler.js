import networkManager from "./networking/networkManager.js";

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
        const url = `${networkManager.getDefaultHost()}/api/auth/refresh`;
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

//JWT 디코딩 함수
function decodeJWT(jwtToken) {
    const paylaodBase64Url = jwtToken.split('.')[1];
    const payloadBase64 = paylaodBase64Url.replace(/-/g, '+').replace(/_/g, '/');
    const payloadJson = atob(payloadBase64);
    return JSON.parse(payloadJson);
}

//토큰 만료 체크 함수
async function isTokenExpired(){
    try {
        const tokens = await getToken();
        const jwtToken = tokens.jwtToken;
        const payload = decodeJWT(jwtToken);
        const currentTime = Date.now();
        const expirationTime = payload.exp * 1000;
        const expirationDate = new Date(expirationTime);
        const currentDate = new Date(currentTime);
        console.log("current time:", currentDate.toLocaleString());
        console.log("token expiring date:",expirationDate.toLocaleString());
        const oneHourInMilliseconds = 60 * 60 * 1000;

        //만료되었거나 만료까지 1시간 미만일 때, true를 리턴
        return currentTime >= expirationTime || (expirationTime - currentTime) < oneHourInMilliseconds;
    } catch (error) {
        console.error("Invalid token:", error);
        return false;
    }
}

export { tokenRefreshHandler, isTokenExpired };