function savePageData(tabId, onSaveFinished = (response) => { }) {
    //해당 탭의 content에 메시지 전송
    const callback = (response) => {
        console.log("savePageData: 데이터 추출 완료: " + JSON.stringify(response));


        //TODO: 추출된 데이터를 서버에 전송한다.

        //TODO: 서버 호출 후 콜백으로 변경
        onSaveFinished(response);
    }
    const message = { action: "EXTRACT_PAGE_DATA" };
    chrome.tabs.sendMessage(tabId, message, callback);
}

export { savePageData };