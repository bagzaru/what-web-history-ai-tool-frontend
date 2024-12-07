import dummyModule from "../../debugging/dummyModule.js";
import networkManager from "../networking/networkManager.js";
import { domLoadHandler as updateCurrentTabOnDomLoad } from "../tabFocusManager.js";
import { savePageData } from "../savePageData.js";
import onDOMLoaded from "./domReadyHandler/onDOMLoaded.js";

let senderEventMap = {};
function onMessageReceived(message, sender, sendResponse) {
    console.log("message received: " + JSON.stringify(senderEventMap) + "from" + message.senderName + " " + message.action);
    for (const key in senderEventMap) {
        if (key === message.senderName) {
            if (senderEventMap[key][message.action] !== undefined) {
                console.log(`sender: ${key}, action: ${message.action}`);
                senderEventMap[key][message.action](message, sender)
                    .then((response) => {
                        sendResponse(response);
                    }).catch((e) => {
                        console.error(`sender: ${key}, action: ${message.action}에 대한 리스너 실행 중 에러: ${e.message}`);
                        sendResponse({
                            data: null, message: e.message
                        });
                        return true;
                    });
            }
            else {
                console.error(`sender: ${key}, action: ${message.action}에 대한 리스너가 없음`);
                break;
            }
        }
    }
}
function addMessageHandler({ senderName, eventName, listener }) {
    if (senderEventMap[senderName] === undefined) {
        senderEventMap[senderName] = {};
    }
    if (senderEventMap[senderName][eventName] === undefined) {
        senderEventMap[senderName][eventName] = listener;
    } else {
        console.error(`이미 존재하는 senderName: ${senderName}, eventName: ${eventName}`);
    }
}

addMessageHandler(onDOMLoaded);

//content, popup 등에서 전송된 Message 값 처리
function messageHandler(message, sender, sendResponse) {
    if (message.action === "DOM_LOADED") {


        //DOM Distiller를 통해 요약된 데이터 추출
        /*chrome.tabs.sendMessage(
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
            });*/

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

        networkManager.get.getHistories(message.data.orderBy)
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
        // networkManager.put.extractKeywords(message.data.url)
        //     .then((data) => {
        //         sendResponse({ data: data });
        //     }).catch((e) => {
        //         sendResponse({ data: null, message: e.message });
        //     })
        return true;
    }
    else if (message.action === "SAVE_PAGE_DATA") {
        //'페이지 저장' 이벤트 발생 시
        // - content script에서 페이지 데이터를 추출하여 서버에 전송한다.

        //현재 focus된 content tab의 위치 확인하여 데이터 추출 요청
        const query = { active: true, lastFocusedWindow: true };
        const onTabQueryFinished = (tabs) => {
            if (tabs.length > 0) {
                const tabId = tabs[0].id;
                const onSaveFinished = (response) => {
                    console.log("SAVE_PAGE_DATA: 데이터 추출 완료: " + JSON.stringify(response));
                    sendResponse({ data: response });
                }
                const onSaveFailed = (e) => {
                    console.error("SAVE_PAGE_DATA: 데이터 추출 실패: " + e.message);
                    sendResponse({ data: null, message: e.message });
                }
                savePageData(tabId, onSaveFinished, onSaveFailed);
            }
        }

        chrome.tabs.query(query, onTabQueryFinished);

        return true;
    }
    else if (message.action === "GET_ALL_DATA_LIST") {
        //popup에서 전체 데이터 리스트를 요청했을 때
        //TODO: 실제 서버에서 데이터를 받아오도록 수정
        const startDate = new Date(2000, 0, 1);
        const endDate = new Date();
        networkManager.get.getHistories("visitTime", startDate, endDate)
            .then((data) => {
                console.log("GET_ALL_DATA_LIST: 데이터 요청 성공");
                sendResponse({ data: data });
            }).catch((e) => {
                console.log("GET_ALL_DATA_LIST: 데이터 요청 실패: " + e.message);
                sendResponse({ data: null, message: e.message });
            });
        return true;
    }
    else if (message.action === "GET_SEARCH_DATA_LIST") {
        //popup에서 전체 데이터 리스트를 요청했을 때
        //TODO: 실제 서버에서 데이터를 받아오도록 수정\

        console.log("GET_SEARCH_DATA_LIST: 데이터 요청" + JSON.stringify(message.data));


        const startDate
            = (message.startDate !== undefined || message.data.startDate !== "")
                ? new Date(message.data.startDate)
                : new Date(2000, 0, 1);
        startDate.setHours(0, 0, 0, 0);
        const endDate
            = (message.endDate !== undefined || message.data.endDate !== "")
                ? new Date(message.data.endDate)
                : new Date();
        endDate.setHours(23, 59, 59, 999);

        console.log("GET_SEARCH_DATA_LIST: 수정된 start-end Date" + startDate + " ~ " + endDate);
        const domain = message.data.domain;
        const query = message.data.query;
        const category = "";
        networkManager.post.search(startDate, endDate, query, domain, category).then((data) => {
            console.log("GET_SEARCH_DATA_LIST: 데이터 요청 성공");
            sendResponse({ data: data });
        })
            .catch((e) => {
                console.log("GET_SEARCH_DATA_LIST: 데이터 요청 실패:" + e.message);
                sendResponse({ data: null, message: e.message });
            });

        return true;
    }
    return false;
}

export { onMessageReceived };