const googleLoginButton = document.getElementById("google-login-button");
googleLoginButton.addEventListener('click', () => {
    const backendLoginUrl = "https://capstonepractice.site/oauth2/authorization/google";
        // 팝업 창을 열어 백엔드 로그인 url로 이동
    chrome.windows.create(
        {
            url: backendLoginUrl,
            type: "popup",
            width: 500,
            height: 700,
        }
    );
});