const googleLoginButton = document.getElementById("google-login-button");

// 로그인 버튼을 눌렀을 때, 로그인 요청 message를 service-worker.js에 보냄.
// new Promise를 사용해 응답이 올 때까지 기다림.
googleLoginButton.addEventListener('click', async() => {
    try {
        const response = await new Promise((resolve, reject) => {
            chrome.runtime.sendMessage({ action: "LOGIN_REQUEST" }, (response) => {
                if (chrome.runtime.lastError) {
                    reject(chrome.runtime.lastError);
                } else {
                    resolve(response);
                }
            });
        });
        console.log("response data:", response);
        if (response.data === true) {
            console.log("From login.js : Login Success");
            window.parent.location.reload();
        } else {
            console.log("From login.js : Login Failed");
        }
    } catch (error) {
        console.error("Login request failed:", error);
    }
});