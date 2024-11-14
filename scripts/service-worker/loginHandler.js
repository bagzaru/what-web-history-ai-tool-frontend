
async function loginHandler(details) {
    try {
        if (
            details.url.includes("/api/auth/oauth2/google") &&
            details.statusCode === 200
        ) {
            // console.log("OAuth2 요청 완료:", details);
            // console.log("헤더", details.responseHeaders);
            
            // 헤더에서 JWT토큰 추출
            const responseHeaders = details.responseHeaders;
            const tokenHeader = responseHeaders?.find(
                (header) => header.name.toLowerCase() === "authorization"
            );

            if (tokenHeader) {
                const token = tokenHeader.value.split("Bearer ")[1];

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
        }
    } catch (error) {
        console.error("JWT 토큰 가져오기 실패:", error);
    }
}

export { loginHandler };