//페이지 방문 이벤트 발생
// - 조건: url 변경 or 페이지 load 콜백 실행
// 외부적으로 실행할 일
//  - 현재 페이지 방문 정보 DB에 저장, 서버에 전송
//  - 페이지 글 긁어옴
//  - 체류 시간 체킹 시작, 
//  - timer check 

//localHistoryDB에 저장할 것들
const frame = {
    visitTime: "",
    title: "",
    url: "",
    timeOnPage: "",
    pageData: ""
}

//
function pushToLocalHistory({ title, url, innerText, ...others }) {
    chrome.storage.local.get(['localHistoryDB'], (result) => {
        let currentArray = result.localHistoryDB || [];

        let temp = { ...frame };
        temp.visitTime = new Date();
        temp.title = title;
        temp.url = url;
        temp.innerText = innerText;
        temp.timer = 0;

        currentArray.push(temp);

        chrome.storage.local.set({ localHistoryDB: currentArray }, () => {
            //console.log("배열에 저장 완료");
        })
        console.log("WHAT Ext: local storage: " + result);
    })
}

//content, popup 등에서 전송된 Message 값 처리
chrome.runtime.onMessage.addListener((message, sender, sendResponse) => {
    //content.js에서 INNERTEXT값이 전송되었다면, localHistoryDB를 update
    if (message.action === "SEND_HTML_INNERTEXT") {
        pushToLocalHistory(message.data);
        sendResponse({ k: "good" });

        return true;
    }
    else {
        sendResponse({ k: message.action });
        return false;
    }
});




//이전 코드
//Update가 완료되면 실행된다.
// chrome.tabs.onUpdated.addListener((tabId, changeInfo, tab) => {
//     if (changeInfo.status == 'complete' && /^https?:\/\//.test(tab.url)) {
//         chrome.scripting.executeScript({
//             target: { tabId: tabId },
//             func: getInnerText
//         });
//     }
// });