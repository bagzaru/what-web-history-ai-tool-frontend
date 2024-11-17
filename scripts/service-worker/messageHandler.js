import dummyModule from "../debugging/dummyModule.js";
import networkManager from "./networkManager.js";
import { domLoadHandler } from "./tabFocusManager.js";

//content, popup 등에서 전송된 Message 값 처리
function messageHandler(message, sender, sendResponse) {
    if (message.action === "DOM_LOADED") {
        //content의 domReadyHandler에서 DOM이 Load됨을 감지되었을 때 실행
        console.log("service-worker msg Handler: DOM LOADED!!" + message.data.url);

        //데이터 서버에 전송할 데이터 제작
        let data = {
            title: message.data.title,
            url: message.data.url,
            content: message.data.pageData
        }

        //tabFocusManager의 url 업데이트함
        domLoadHandler(sender.tab.id, message.data.url);

        //DOM Distiller를 통해 요약된 데이터 추출
        chrome.tabs.sendMessage(
            sender.tab.id,
            { action: "DOM_DISTILLER_EXTRACT", data: {} },
            (response) => {
                if (response === undefined) {
                    console.log("issue#3 문제 발생, URL: " + message.data.url + ", 탭 id: " + sender.tab.id);
                }
                else if (response.data !== undefined) {
                    //DOM Distiller에 오류가 없었을 경우
                    data.title = response.data.title;
                    data.content = response.data.content;
                }
                console.log("DOM extracted");
                //console.log("원본: " + message.data.pageData);
                //console.log("Sending Data title:" + data.title + ", content: " + data.content);

                //텍스트 데이터를 서버에 전송
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
            });

        //TODO: Distiller를 사용하는 경우와 사용하지 않는 경우 나누기
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
    else if (message.action === "SAVE_PAGE_DATA") {
        //'페이지 저장' 이벤트 발생 시
        // - content script에서 페이지 데이터를 추출하여 서버에 전송한다.

        //현재 focus된 content tab의 위치 확인하여 데이터 추출 요청
        const query = { active: true, lastFocusedWindow: true };
        const extractCallback = (tabs) => {
            if (tabs.length > 0) {
                const tab = tabs[0];
                const tabId = tab.id;
                const message = { action: "EXTRACT_PAGE_DATA" };
                const callback = (response) => {
                    //TODO: 추출된 데이터를 서버에 전송한다.
                    console.log("SAVE_PAGE_DATA: 데이터 추출 완료: " + JSON.stringify(response));
                    sendResponse({ data: response });
                }

                //해당 탭의 content에 메시지 전송
                chrome.tabs.sendMessage(tabId, message, callback);
            }
            else {
                console.log("messageHandler: SAVE_PAGE_DATA실패: active tab이 없습니다.");
            }
        }
        chrome.tabs.query(query, extractCallback);

        return true;
    }
    else if (message.action === "GET_ALL_DATA_LIST") {
        //popup에서 전체 데이터 리스트를 요청했을 때
        //TODO: 실제 서버에서 데이터를 받아오도록 수정
        const data = dummyModule.getDummyData();
        console.log("data: " + JSON.stringify(data));
        setTimeout(() => {
            sendResponse({ data: data });
        }, 1000);

        return true;
    } else if (message.action === "GET_SEARCH_DATA_LIST") {
        //popup에서 전체 데이터 리스트를 요청했을 때
        //TODO: 실제 서버에서 데이터를 받아오도록 수정
        const data = dummyModule.getDummyData(message.data);
        console.log("data: " + JSON.stringify(data));
        setTimeout(() => {
            sendResponse({ data: data });
        }, 1000);

        return true;
    }
    return false;
}

export { messageHandler };