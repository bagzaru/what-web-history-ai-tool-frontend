console.log("contentReadyHandler working");
console.log("contentReadyHandler: document ready? " + document.readyState);

//readyState가 loading중이 아니면, DOM은 로드되었으므로 텍스트 크롤링
// 참고: content.js가 로드되었을 때 DOM은 어지간하면 로드 되어있는듯하다.

if (document.readyState === "loading") {
    document.addEventListener('DOMContentLoaded', function () {
        chrome.runtime.sendMessage({ action: "DOM_LOADED" }, (response) => {
            console.log("DOM load 완료, 메시지 service-worker로 전송");
        })
    })
}
else {
    chrome.runtime.sendMessage({ action: "DOM_LOADED" }, (response) => {
        console.log("DOM load 완료, 메시지 service-worker로 전송");
    })
}

