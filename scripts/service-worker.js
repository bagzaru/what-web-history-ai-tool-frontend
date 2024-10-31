import { messageHandler } from "./service-worker/messageHandler.js";
import { tabActivationHandler, windowFocusChangeHandler } from "./service-worker/tabFocusManager.js";
import { loginHandler } from "./service-worker/loginHandler.js";

console.log("service-worker on");

chrome.runtime.onMessage.addListener(messageHandler);
chrome.tabs.onActivated.addListener(tabActivationHandler);
chrome.windows.onFocusChanged.addListener(windowFocusChangeHandler);

chrome.webRequest.onCompleted.addListener(loginHandler,
    {
        urls: ["https://capstonepractice.site/api/auth/oauth2/google"],
    },
    ["responseHeaders"]
);

/* 이하는 테스트용 코드 */

// //onCommitted, onCompleted 확인
// chrome.webNavigation.onCommitted.addListener(function (details) {
//     console.log(`onCommitted 완료, url: ${details.url}`);
// }/*, { url: [{ urlMatches: 'https://example.com/*' }] }*/);

// chrome.webNavigation.onCompleted.addListener((details) => {
//     console.log(`onCompleted 완료, url: ${details.url}`);
// });

// //방문기록 업데이트 확인
// chrome.webNavigation.onHistoryStateUpdated.addListener((details) => {
//     console.log(`service-worker: onHistoryStateUpdated 완료, uuid: ${details.documentId}, url: ${details.url}`);
// });
