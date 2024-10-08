import server from "./server.js";

//content, popup 등에서 전송된 Message 값 처리
function messageHandler(message, sender, sendResponse) {
    if (message.action === "DOM_LOADED") {
        console.log("service-worker msg Handler: DOM LOADED!!");
        const data = {
            title: message.data.title,
            url: message.data.url,
            postData: message.data.postData
        }
        //텍스트 데이터 서버에 전송
        server.post.saveHistory(data);
    }
    else if (message.action === "SERVER_STATE_CHANGED") {
        server.setServerState(message.data);

        console.log("server State chagned: " + message.data);
        sendResponse({ data: message.data });
    }
    else {
        sendResponse({ k: message.action });
        return false;
    }
}

export { messageHandler };