//1. 페이지 로드 완료 시 innerText 추출하여 전송
// - 확인해야 할것: AJAX 등 나중에 로드되는 데이터가 있다면?, 이미지, 동영상 등 데이터는?

//import { debugMessageHandler } from "./content/content-debugger.js";
const MessageActions = {
    LOG: "LOG"
};
function debugMessageHandler(message, sender, sendResponse) {
    if (message.action === MessageActions.LOG) {
        console.log("msg from background: " + message.data);
        sendResponse({ result: "good" });
    }
    else {
        sendResponse({ result: "undefined Message" });
    }
}

//페이지 체류 시간
let pageOnTime = 0;
let lastCheckedTime = 0;

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

//디버그 관련 메시지 핸들
chrome.runtime.onMessage.addListener(debugMessageHandler);