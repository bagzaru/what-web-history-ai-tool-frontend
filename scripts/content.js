//1. 페이지 로드 완료 시 innerText 추출하여 전송
// - 확인해야 할것: AJAX 등 나중에 로드되는 데이터가 있다면?, 이미지, 동영상 등 데이터는?

const ExtMessages = {
    SEND_HTML_INNERTEXT: "SEND_HTML_INNERTEXT"
}

console.log("WHAT extension: content.js initialized");
const innerText = document.querySelector("body").innerText;

//innerText 추출이 완료되면, extension의 service-worker에 text 전송
const pageData = {
    title: document.title,
    url: window.location.href,
    innerText: innerText
}

chrome.runtime.sendMessage({ action: "SEND_HTML_INNERTEXT", data: pageData }, (response) => {
    if (response.k) {
        console.log("WHAT:content.js: innerText 전송 성공" + response.k);
    }
    else {
        console.log("WHAT ext: content k 실패");
    }
});
