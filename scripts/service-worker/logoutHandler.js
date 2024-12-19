import { defaultHost } from "./networking/networkManager";

async function logoutHandler(){
    try {
        const token = await getToken();
        const defaultHeader = {
            "Accept": "*/*",
            "Authorization": `Bearer ${token}`,
        };
        const url = `${defaultHost}/api/auth/logout`;
        const options = {
            method: "POST",
            headers: {
                ...defaultHeader,
            },
        };
        const response = await fetch(url, options);
        if (!response.ok) {
            throw new Error(`Server responded with status: ${response.status}`);
        }
        await deleteToken();
        return true;
    } catch (error) {
        console.error("Error in logoutHandler", error);
        return false;
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

// 저장된 토큰 삭제를 동기식으로 처리하기 위한 함수
function deleteToken() {
    return new Promise((resolve, reject) => {
        chrome.storage.sync.remove(['jwtToken','refreshToken','user_email', 'user_picture', 'categories'], () => {
            if (chrome.runtime.lastError) {
                reject(new Error(chrome.runtime.lastError));
            } else {
                console.log("jwt 토큰 및 사용자 정보 삭제 성공");
                resolve();
            }
        });
    });
}

export { logoutHandler };