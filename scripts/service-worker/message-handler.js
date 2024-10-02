
function messageHandler(message, sender, sendResponse) {
    //content.js에서 INNERTEXT값이 전송되었다면, localHistoryDB를 update
    if (message.action === "SEND_HTML_INNERTEXT") {
        //DTO 제작
        let createdHistory = { ...historyFrame };
        createdHistory.visitTime = (new Date()).getTime();
        createdHistory.title = message.data.title;
        createdHistory.url = message.data.url;
        createdHistory.pageData = message.data.innerText;
        createdHistory.timeOnPage = 0;

        //현재 context에 push
        localHistoryData.push(createdHistory);

        //context의 값을 데이터에도 갱신
        chrome.storage.local.set({ localHistoryDB: localHistoryData }, () => { });

        //tabId와 set의 id를 연결
        tabIdHistoryMap[sender.tab.id.toString()] = localHistoryData.length - 1;

        //TODO: 서버에 전송

        sendResponse({ log: "good", data: createdHistory });

        return true;
    }
    else {
        sendResponse({ k: message.action });
        return false;
    }
}
