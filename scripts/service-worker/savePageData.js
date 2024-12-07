import networkManager from "./networking/networkManager.js";

function savePageData(tabId, onSaveFinished = (response) => { }, onSaveFailed = (response) => { }) {
    //해당 탭의 content에 메시지 전송
    const callback = (response) => {
        console.log("savePageData: 데이터 추출 완료: " + JSON.stringify(response));


        //TODO: 추출된 데이터를 서버에 전송한다.

        //TODO: 서버 호출 후 콜백으로 변경
        const data = {
            title: response.data.title,
            url: response.data.url,
            content: response.data.content
        };

        networkManager.post.saveHistory(data)
            .then(onSaveFinished)
            .catch(onSaveFailed);
    }
    const message = { action: "EXTRACT_PAGE_DATA" };
    chrome.tabs.sendMessage(tabId, message, callback);
}

export { savePageData };