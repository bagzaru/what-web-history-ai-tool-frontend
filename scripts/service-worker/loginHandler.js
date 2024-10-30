
async function loginHandler(details) {
    try {
        if (
            details.url.includes("/api/auth/oauth2/google") &&
            details.statusCode === 200 &&
            details.initiator === "https://accounts.google.com"
        ) {
            const response = await fetch(details.url);
            if (!response.ok) {
                console.error("토큰 가져오기 실패, 상태 코드:", response.status);
                return;
            }
    
            const data = await response.json();
            const token = data.token;

            // console.log("OAuth2 요청완료", details);

            if (token) {
                // Chrome 스토리지에 토큰 저장
                chrome.storage.local.set({ jwtToken: token }, () => {
                    if (chrome.runtime.lastError) {
                        console.error("토큰 저장 오류:", chrome.runtime.lastError);
                    } else {
                        console.log("JWT 토큰 저장 성공:", token);

                        // 팝업창 닫기
                        chrome.windows.getAll({ windowTypes: ["popup"] }, (windows) => {
                            windows.forEach((win) => {
                                chrome.tabs.query({ windowId: win.id }, (tabs) => {
                                    tabs.forEach((tab) => {
                                        if (tab.url.includes("capstonepractice.site")) {
                                            chrome.windows.remove(win.id, () => {
                                            console.log("팝업 창이 닫혔습니다:", tab.url);
                                            });
                                        }
                                    });
                                });
                            });
                        });
                    }
                });
            }
        }
    } catch (error) {
        console.error("JWT 토큰 가져오기 실패:", error);
    }
}

export { loginHandler };