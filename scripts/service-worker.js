import { messageHandler } from "./service-worker/messageHandler.js";

console.log("service-worker on");

chrome.runtime.onMessage.addListener(messageHandler);

//onCommitted, onCompleted 확인
chrome.webNavigation.onCommitted.addListener(function (details) {
    console.log("onCommitted 완료");
}/*, { url: [{ urlMatches: 'https://example.com/*' }] }*/);

chrome.webNavigation.onCompleted.addListener((details) => {
    console.log("onCompleted 완료");
});

//방문기록 업데이트 확인
chrome.webNavigation.onHistoryStateUpdated.addListener((details) => {
    console.log("service-worker: onHistoryStateUpdated 완료");
});
