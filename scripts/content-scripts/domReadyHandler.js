console.log("domReadyHandler working");
console.log("domReadyHandler: document ready? " + document.readyState);

function onDOMLoaded() {
    //innerText 추출이 완료되면, extension의 service-worker에 text 전송
    const innerText = document.querySelector("body").innerText;
    const pageData = {
        title: document.title,
        url: window.location.href,
        innerText: innerText
    }

    //TODO: service-worker에 text 전송
    chrome.runtime.sendMessage({ action: "DOM_LOADED" }, (response) => {
        console.log("DOM load 완료, 메시지 service-worker로 전송");
    });
}

//readyState가 loading중이 아니면, DOM은 로드되었으므로 텍스트 크롤링
// 참고: content.js가 로드되었을 때 DOM은 어지간하면 로드 되어있는듯하다.
if (document.readyState === "loading") {
    document.addEventListener('DOMContentLoaded', onDOMLoaded);
}
else {
    onDOMLoaded();
}