chrome.runtime.onMessage.addListener(function (message, sender, sendResponse) {
    if (message.action === "SW_POPUP_HISTORIES") {


        sendResponse({ data: true });
    }
    else {
        sendResponse({ data: false });
    }
});

//서버 선택
window.onload = function () {
    document.querySelector("#radio-on")
        .addEventListener('change', (event) => {
            if (event.target.checked) {
                //서버 연결 시작
                chrome.runtime.sendMessage({ action: "SERVER_STATE_CHANGED", data: true }, (response) => { });
            }
        });
    document.querySelector("#radio-off")
        .addEventListener('change', (event) => {
            if (event.target.checked) {
                //서버 연결 끊기                
                chrome.runtime.sendMessage({ action: "SERVER_STATE_CHANGED", data: false }, (response) => { });
            }
        })



}

function loadHistoryData(orderBy) {
    //s-w에 로드됨 보냄
    chrome.runtime.sendMessage({ action: "POPUP_GET_HISTORY", data: { orderBy: orderBy } }, (response) => {
        //서버에서 받아온 데이터 처리
        const table = document.getElementById('keyword-table').getElementsByTagName('tbody')[0];
        const log = document.getElementById('debugLog');
        const data = response.data;
        if (data === null) {
            //TODO: 서버 송신 오류 처리
            const newRow = table.insertRow();

            newRow.insertCell().textContent = "네트워크 오류 발생";
            return;
        }

        //log.innerText = "received data: " + JSON.stringify(data);

        const len = data.length;
        for (let i = 0; i < (len < 5 ? len : 5); i++) {
            const rowData = data[i];
            const newRow = table.insertRow();

            const title = rowData.title;
            const keyword = rowData.keywords.join(', ');
            const visitCount = rowData.visitCount;

            newRow.insertCell().textContent = title;
            newRow.insertCell().textContent = keyword;
            newRow.insertCell().textContent = visitCount;
        }
    });
}

loadHistoryData("visitCount");
