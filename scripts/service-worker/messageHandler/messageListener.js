import dummyModule from "../../debugging/dummyModule.js";
import networkManager from "../networking/networkManager.js";
import { domLoadHandler as updateCurrentTabOnDomLoad } from "../tabFocusManager.js";
import { savePageData } from "../savePageData.js";
import onDOMLoaded from "./domReadyHandler/onDOMLoaded.js";
import onGetHistories from "./deprecated/onGetHistories.js";



addMessageHandler(onDOMLoaded);
addMessageHandler(onGetHistories);

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

//content, popup 등에서 전송된 Message 값 처리
function messageHandler(message, sender, sendResponse) {
    if (message.action === "GET_ALL_DATA_LIST") {
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