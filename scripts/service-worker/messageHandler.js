import { post } from "./networking/dataSender.js";
import { createHistoryBody } from "./localhistory.js";
import { setServerState } from "./serverState.js";

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
    else if (message.action === "SERVER_STATE_CHANGED") {
        setServerState(message.data);

        console.log("server State chagned: " + message.data);
        sendResponse({ data: message.data });
    }
    else {
        sendResponse({ k: message.action });
        return false;
    }
}

export { messageHandler };