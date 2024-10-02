import { messageHandler } from "./service-worker/message-handler";

//content, popup 등에서 전송된 Message 값 처리
chrome.runtime.onMessage.addListener(messageHandler);