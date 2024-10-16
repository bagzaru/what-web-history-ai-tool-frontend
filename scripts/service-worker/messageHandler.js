import networkManager from "./networkManager.js";

//content, popup 등에서 전송된 Message 값 처리
function messageHandler(message, sender, sendResponse) {
    if (message.action === "DOM_LOADED") {
        //content의 domReadyHandler에서 DOM이 Load됨을 감지되었을 때 실행
        console.log("service-worker msg Handler: DOM LOADED!!");

        //데이터 서버에 전송할 데이터 제작
        const data = {
            title: message.data.title,
            url: message.data.url,
            content: message.data.pageData
        }

        //텍스트 데이터 서버에 전송
        networkManager.post.saveHistory(data)
            .then(async () => {
                try {
                    //24.10.16: 현재 자동 키워드 추출 사용하지 않음(비용 문제)
                    // - 실제 릴리즈 시에는 사용할 예정
                    //await server.put.extractKeywords(data.url);
                    //console.log("extractKeywords 성공적");
                }
                catch (e) {
                    console.log(`extractKeywords error: ${e.message}`);
                }
            })
            .catch((e) => {
                console.log(`saveHistory Error: ${e.message}`);
            });
    }
    else if (message.action === "NETWORK_STATE_CHANGED") {
        //popup에서 serverState값이 바뀌었을 때에 대한 대응
        networkManager.setNetworkState(message.data);

        console.log("server State changed: " + message.data);
        sendResponse({ data: message.data });
    }
    else if (message.action === "POPUP_GET_HISTORY") {
        //popup.js에서 history load 요청이 있었을 때
        console.log("POPUP: getHistoryDate 요청");

        networkManager.get.getHistoryByDate(message.data.orderBy)
            .then((data) => {
                console.log("getHistoryDate 요청 성공");
                sendResponse({ data: data });
            })
            .catch((e) => {
                //s-w에 로드됨 보냄
                console.log("getHistoryDate 요청 실패");
                sendResponse({ data: null });
            });
        return true;
    }
    else if (message.action === "GET_NETWORK_STATE") {
        //popup이나 content에서 서버 state가 알고싶다고 요청할 때
        sendResponse({ data: networkManager.getNetworkState() });
    }
    else if (message.action === "GPT_REQUEST_EVENT") {
        //popup의 GPT 요청 버튼 눌렸을 때의 이벤트
        //비용 문제로 인해 제작한 스크립트, 릴리즈 시에는 삭제 예정
        networkManager.put.extractKeywords(message.data.url)
            .then((data) => {
                sendResponse({ data: data });
            }).catch((e) => {
                sendResponse({ data: null, message: e.message });
            })
        return true;
    }
    else {
        sendResponse({ k: message.action });
        return false;
    }
}

export { messageHandler };