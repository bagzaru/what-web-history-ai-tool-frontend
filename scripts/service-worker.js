import { messageHandler } from "./service-worker/message-handler.js";

console.log("service-worker on");






//content, popup 등에서 전송된 Message 값 처리
chrome.runtime.onMessage.addListener(messageHandler);

chrome.webNavigation.onCommitted.addListener(function (details) {
    console.log("onCommitted 완료");
}/*, { url: [{ urlMatches: 'https://example.com/*' }] }*/);

chrome.webNavigation.onCompleted.addListener((details) => {
    console.log("onCompleted 완료");
});

chrome.webNavigation.onHistoryStateUpdated.addListener((details) => {

    console.log("service-worker: onHistoryStateUpdated 완료");
});
