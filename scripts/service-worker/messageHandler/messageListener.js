import dummyModule from "../../debugging/dummyModule.js";
import networkManager from "../networking/networkManager.js";
import onDOMLoaded from "./domReadyHandler/onDOMLoaded.js";
import onGetHistories from "./deprecated/onGetHistories.js";
import onGetNetworkState from "./deprecated/onGetNetworkState.js";
import onNetworkStateChanged from "./deprecated/onNetworkStateChanged.js";
import onSavePageData from "./deprecated/onSavePageData.js";
import onGetAllDataList from "./popup/onGetAllDataList.js";
import onGetSearchDataList from "./popup/onGetSearchDataList.js";
import onGetStatistics from "./popup/onGetStatistics.js";
import onDeleteData from "./popup/onDeleteData.js";
import onUpdateData from "./popup/onUpdateData.js";
import onGetDetailData from "./popup/onGetDetailData.js";

let senderEventMap = {};

addMessageHandler(onDOMLoaded);
addMessageHandler(onGetHistories);
addMessageHandler(onGetNetworkState);
addMessageHandler(onNetworkStateChanged);
addMessageHandler(onSavePageData);
addMessageHandler(onGetAllDataList);
addMessageHandler(onGetSearchDataList);
addMessageHandler(onGetStatistics);
addMessageHandler(onDeleteData);
addMessageHandler(onUpdateData);
addMessageHandler(onGetDetailData);

function onMessageReceived(message, sender, sendResponse) {
    console.log(`messageListener: message recieved, sender: ${message.senderName}, action: ${message.action}`);
    for (const key in senderEventMap) {
        if (key === message.senderName) {
            if (senderEventMap[key][message.action] !== undefined) {
                //console.log(`sender: ${key}, action: ${message.action}`);
                senderEventMap[key][message.action](message, sender)
                    .then((response) => {
                        sendResponse(response);
                    }).catch((e) => {
                        console.error(`sender: ${key}, action: ${message.action}에 대한 리스너 실행 중 에러: ${e.message}`);
                        sendResponse({
                            data: null, message: e.message
                        });
                    });

                return true;
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

export { onMessageReceived };