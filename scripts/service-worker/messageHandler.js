import server from "./server.js";

//content, popup 등에서 전송된 Message 값 처리
function messageHandler(message, sender, sendResponse) {
    if (message.action === "DOM_LOADED") {
        console.log("service-worker msg Handler: DOM LOADED!!");
        const data = {
            title: message.data.title,
            url: message.data.url,
            content: message.data.pageData
        }
        //텍스트 데이터 서버에 전송
        server.post.saveHistory(data)
            .then(async () => {
                try {
                    await server.put.extractKeywords(data.url);
                    console.log("extractKeywords 성공적");
                }
                catch (e) {
                    console.log(`extractKeywords error: ${e.message}`);
                }
            })
            .catch((e) => {
                console.log(`saveHistory Error: ${e.message}`);
            });
    }
    else if (message.action === "SERVER_STATE_CHANGED") {
        server.setServerState(message.data);

        console.log("server State chagned: " + message.data);
        sendResponse({ data: message.data });
    }
    else if (message.action === "POPUP_GET_HISTORY") {
        //서버에 getkeyword 처리

        server.get.getHistoryByDate(message.data.orderBy)
            .then((data) => {
                chrome.runtime.sendMessage({ action: "SW_POPUP_HISTORIES", data: data }, (response) => {
                    console.log("get 성공!");
                });
                sendResponse({ data: data });
            })
            .catch((e) => {
                //s-w에 로드됨 보냄
                console.log("getHistoryDate: 실패: " + e.message)
                chrome.runtime.sendMessage({ action: "SW_POPUP_HISTORIES", data: null }, (response) => {
                });
                sendResponse({ data: null });
            });
        return true;
    }
    else if (message.action === "GET_SERVER_STATE") {
        sendResponse({ data: server.getServerState() });
    }
    else {
        sendResponse({ k: message.action });
        return false;
    }
}

export { messageHandler };