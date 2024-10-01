//페이지 방문 이벤트 발생
// - 조건: url 변경 or 페이지 load 콜백 실행
// 외부적으로 실행할 일
//  - 현재 페이지 방문 정보 DB에 저장, 서버에 전송
//  - 페이지 글 긁어옴
//  - 체류 시간 체킹 시작, 
//  - timer check 

//localHistoryDB에 저장할 것들
const historyFrame = {
    visitTime: "",
    title: "",
    url: "",
    timeOnPage: "",
    pageData: ""
}

let localHistoryData = [];
let tabIdHistoryMap = {};      //

async function loadLocalHistoryDB() {
    const key = 'localHistoryDB';

    //load하여 localHistoryData 배열에 저장.
    localHistoryData = await new Promise((resolve, reject) => {
        chrome.storage.local.get([key], (result) => {
            if (chrome.runtime.lastError) {
                return reject(chrome.runtime.lastError);
            }
            resolve(result[key]);
        })
    });
}

//localHistory 데이터를 갱신한다.
function pushToLocalHistory(tabId, { title, url, innerText, ...others }) {
}

//데이터 로드
loadLocalHistoryDB();

//content, popup 등에서 전송된 Message 값 처리
chrome.runtime.onMessage.addListener((message, sender, sendResponse) => {
    //content.js에서 INNERTEXT값이 전송되었다면, localHistoryDB를 update
    if (message.action === "SEND_HTML_INNERTEXT") {
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
    else if (message.action === "UPDATE_TIMER") {
        //타이머 값 업데이트
        const i = tabIdHistoryMap[sender.tabId.toString()];
        localHistoryData[i].timeOnPage = message.data;
        //context의 값을 데이터에도 갱신
        chrome.storage.local.set({ localHistoryDB: localHistoryData }, () => { });

        sendResponse({ log: "good", data: localHistoryData[i] });
    }
    else {
        sendResponse({ k: message.action });
        return false;
    }
});