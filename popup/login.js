const googleLoginButton = document.getElementById("google-login-button");
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
        } else {
            console.log("From login.js : Login Failed");
        }
    } catch (error) {
        console.error("Login request failed:", error);
    }
});