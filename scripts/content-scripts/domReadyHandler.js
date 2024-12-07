//domReadyHandler.js: HTML의 DOM이 준비되었을 때, 서비스워커에게 DOM이 준비되었음을 반환합니다.
const domReadyHandlerName = "domReadyHandler";

console.log("domReadyHandler working");

//readyState가 loading중이 아니면, DOM은 로드되었으므로 즉시 DOMLoaded 이벤트 발생, loading이면 loading이 끝났을 때 이벤트 발생하도록 걸어둠
// 참고: content script가 로드되었을 때 DOM은 어지간하면 로드 되어있는듯하다.
if (document.readyState === "loading") {
    document.addEventListener('DOMContentLoaded', onDOMLoaded);
}
else {
    onDOMLoaded();
}

//extension의 service-worker에 text 전송하는 함수
function onDOMLoaded() {
    //데이터 추출
    const innerText = document.querySelector("body").innerText;
    const data = {
        title: document.title,
        url: window.location.href,
        pageData: innerText
    }

    //service-worker에 전송
    chrome.runtime.sendMessage({ senderName: domReadyHandlerName, action: "DOM_LOADED", data: data }, (response) => {
        console.log("content:domReadyHandler: DOM load 완료");
    });
}