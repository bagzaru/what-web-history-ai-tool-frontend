
// async function loginHandler(details) {
//     try {
//         if (
//             details.url.includes("/api/auth/oauth2/google") &&
//             details.statusCode === 200
//         ) {
//             // console.log("OAuth2 요청 완료:", details);
//             // console.log("헤더", details.responseHeaders);
            
//             // 헤더에서 JWT토큰 추출
//             const responseHeaders = details.responseHeaders;
//             const tokenHeader = responseHeaders?.find(
//                 (header) => header.name.toLowerCase() === "authorization"
//             );

//             if (tokenHeader) {
//                 const token = tokenHeader.value.split("Bearer ")[1];

//                 if (token) {
//                     // Chrome 스토리지에 토큰 저장
//                     chrome.storage.local.set({ jwtToken: token }, () => {
//                         if (chrome.runtime.lastError) {
//                             console.error("토큰 저장 오류:", chrome.runtime.lastError);
//                         } else {
//                             console.log("JWT 토큰 저장 성공:", token);
    
//                             // 팝업창 닫기
//                             chrome.windows.getAll({ windowTypes: ["popup"] }, (windows) => {
//                                 windows.forEach((win) => {
//                                     chrome.tabs.query({ windowId: win.id }, (tabs) => {
//                                         tabs.forEach((tab) => {
//                                             if (tab.url.includes("capstonepractice.site")) {
//                                                 chrome.windows.remove(win.id, () => {
//                                                 console.log("팝업 창이 닫혔습니다:", tab.url);
//                                                 });
//                                             }
//                                         });
//                                     });
//                                 });
//                             });
//                         }
//                     });
//                 }
//             }
//         }
//     } catch (error) {
//         console.error("JWT 토큰 가져오기 실패:", error);
//     }
// }

// callback 대신 promise 사용
function googleLogin() {
    // const clientId = "304314144761-9gfb9l023pe0cpi5p9efn21uonp9nsfo.apps.googleusercontent.com";
    // const redirectUri = chrome.identity.getRedirectURL();
    // const authUrl = `https://accounts.google.com/o/oauth2/auth?client_id=${clientId}&response_type=token&redirect_uri=${redirectUri}&scope=profile%20email`;

    // chrome.identity.launchWebAuthFlow(
    //     {
    //         url: authUrl,
    //         interactive: true,
    //     },
    //     (redirectUrl) => {
    //         if (chrome.runtime.lastError || !redirectUrl) {
    //             console.error("Authentication failed:", chrome.runtime.lastError);
    //             return;
    //         }
    //         const idToken = new URL(redirectUrl).hash.match(/access_token=([^&]*)/)[1];
    //         console.log("Google OAuth Token:", idToken);

    //         callback(idToken);
    //     }
    // );
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
        fetch("https://capstonepractice.site/api/auth/oauth2/google", {
            method: "POST",
            headers: {
                "Content-Type": "application/json",
            },
            body: JSON.stringify({ token: idToken }),
        })
        .then((response) => {
            if (!response.ok) {
                throw new Error (`Server responded with status: ${response.status}`);
            }
            console.log("response:", response.json());
            return response.json();
        })
        .then((data) => {
            const { jwtToken } = data;
            console.log("JWT Token:", jwtToken);
        })
        .catch((error) => console.error("Error during login:",error));
    } catch (error) {
        console.error("Error in loginHandler", error);
        return false;
    }
}

export { loginHandler };