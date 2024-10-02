import { historyFrame } from "./local-history.js";

function messageHandler(message, sender, sendResponse) {
    if (message.action === "DOM_LOADED") {
        console.log("service-worker msg Handler: DOM LOADED!!")
        //TODO: 텍스트 데이터 서버에 전송
    }
    else {
        sendResponse({ k: message.action });
        return false;
    }
}

export { messageHandler };