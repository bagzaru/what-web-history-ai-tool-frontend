//domReadyHandler.js: HTML의 DOM이 준비되었을 때, 서비스워커에게 DOM이 준비되었음을 반환합니다.
const domReadyHandlerName = "domReadyHandler";

console.log("domReadyHandler working");

onDOMLoaded("empty");
if (document.readyState === "loading") {
    document.addEventListener('DOMContentLoaded', () => { onDOMLoaded('document') });
    window.addEventListener('load', () => { onDOMLoaded('window') });
}
else if (document.readyState === "interactive") {
    onDOMLoaded('document');
    window.addEventListener('load', () => { onDOMLoaded('window') });
}
else if (document.readyState === "complete") {
    onDOMLoaded('document');
    onDOMLoaded('window');
}

//현재 일부 페이지에서 텍스트 데이터가 전부 로드되지 않는 문제가 있음
//extension의 service-worker에 text 전송하는 함수
function onDOMLoaded(loadType = "empty") {
    //데이터 추출
    const innerText = document.querySelector("body").innerText;
    const data = {
        title: document.title,
        url: window.location.href,
        pageData: innerText,
        type: loadType
    }

    //service-worker에 전송
    chrome.runtime.sendMessage({ senderName: domReadyHandlerName, action: "DOM_LOADED", data: data }, (response) => {
        console.log("content:domReadyHandler: DOM load 완료");
    });
}