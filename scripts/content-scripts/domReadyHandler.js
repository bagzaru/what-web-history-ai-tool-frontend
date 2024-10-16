//domReadyHandler.js: HTML의 DOM이 준비되었을 때, 서비스워커에게 DOM이 준비되었음을 반환합니다.
console.log("domReadyHandler working");
console.log("domReadyHandler: document ready? " + document.readyState);

//readyState가 loading중이 아니면, DOM은 로드되었으므로 즉시 DOMLoaded 이벤트 발생, loading이면 loading이 끝났을 때 이벤트 발생하도록 걸어둠
// 참고: content.js가 로드되었을 때 DOM은 어지간하면 로드 되어있는듯하다.
if (document.readyState === "loading") {
    document.addEventListener('DOMContentLoaded', onDOMLoaded);
}
else {
    onDOMLoaded();
}

function onDOMLoaded() {
    //innerText 추출이 완료되면, extension의 service-worker에 text 전송
    const innerText = document.querySelector("body").innerText;
    const data = {
        title: document.title,
        url: window.location.href,
        pageData: innerText
    }

    chrome.runtime.sendMessage({ action: "DOM_LOADED", data: data }, (response) => {
        console.log("DOM load 완료, 메시지 service-worker로 전송");
    });
}