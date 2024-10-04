import { post } from "./service-worker/dataSender.js";
import { createHistoryBody } from "./service-worker/localhistory.js";
console.log("service-worker on");

//content, popup 등에서 전송된 Message 값 처리
function messageHandler(message, sender, sendResponse) {
    if (message.action === "DOM_LOADED") {
        console.log("service-worker msg Handler: DOM LOADED!!")
        //TODO: 텍스트 데이터 서버에 전송
        const path = "/createHistory";
        const body = createHistoryBody((new Date()).getTime, message.data.title, message.data.url, 0, message.data.pageData);

        post(path, body)
            .then((data) => console.log("POST: history created"))
            .catch((err) => console.log("POST: err" + err));
    }
    else {
        sendResponse({ k: message.action });
        return false;
    }
}
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
