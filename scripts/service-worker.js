import { messageHandler } from "./service-worker/message-handler.js";
import { consoleLogOnCurrentTab } from "./service-worker/console-logger.js";

//content, popup 등에서 전송된 Message 값 처리
//chrome.runtime.onMessage.addListener(messageHandler);

chrome.webNavigation.onCommitted.addListener(function (details) {
    consoleLogOnCurrentTab("onCommitted 완료");
}/*, { url: [{ urlMatches: 'https://example.com/*' }] }*/);

chrome.webNavigation.onCompleted.addListener((details) => {
    consoleLogOnCurrentTab("onCompleted 완료");
});