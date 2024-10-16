//server state 확인 후, 
chrome.runtime.sendMessage({ action: "GET_SERVER_STATE" }, (response) => {
    if (response.data === true) {
        document.querySelector("#radio-on").checked = "checked";
    }
    else {
        document.querySelector("#radio-off").checked = "checked";
    }
});


//서버 선택
window.onload = function () {
    document.querySelector("#radio-on")
        .addEventListener('change', (event) => {
            if (event.target.checked) {
                //서버 연결 시작
                chrome.runtime.sendMessage({ action: "SERVER_STATE_CHANGED", data: true }, (response) => {
                    const selected = document.getElementById('dropdown').value;
                    loadHistoryData(selected);
                });
            }
        });
    document.querySelector("#radio-off")
        .addEventListener('change', (event) => {
            if (event.target.checked) {
                //서버 연결 끊기                
                chrome.runtime.sendMessage({ action: "SERVER_STATE_CHANGED", data: false }, (response) => {
                    const selected = document.getElementById('dropdown').value;
                    loadHistoryData(selected);
                });
            }
        })



}



//서버의 방문기록 리스트 로드 관련
const dropdown = document.getElementById('dropdown');
const table = document.getElementById('keyword-table').getElementsByTagName('tbody')[0];
const log = document.getElementById('debugLog');

function loadHistoryData(orderBy) {
    table.innerHTML = '';
    table.insertRow().insertCell().textContent = "로딩 중...";

    //서비스 워커에 로드됨 보냄
    chrome.runtime.sendMessage({ action: "POPUP_GET_HISTORY", data: { orderBy: orderBy } }, (response) => {
        //서버에서 받아온 데이터 처리
        const data = response.data;
        table.innerHTML = '';
        if (data === null) {
            //TODO: 서버 송신 오류 처리
            table.insertRow().insertCell().textContent = "네트워크 오류 발생";
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
            const spentTime = rowData.spentTime;

            newRow.insertCell().textContent = title;
            newRow.insertCell().textContent = keyword;
            newRow.insertCell().textContent = visitCount;
        }
    });
}

loadHistoryData(dropdown.checked);

dropdown.addEventListener('change', function () {
    const selected = dropdown.value;
    loadHistoryData(selected);
})

//gpt 서버에 전송하여 키워드 추출 요청 버튼
const gptRequestButton = document.getElementById("gpt-request-button");
gptRequestButton.addEventListener('click', () => {
    //현재 페이지 어딘지 조회하여 보내기
    chrome.tabs.query({ active: true, currentWindow: true }, function (tabs) {
        var activeTab = tabs[0];
        var activeTabUrl = activeTab.url;

        //gpt 이벤트 요청하기
        chrome.runtime.sendMessage({ action: "GPT_REQUEST_EVENT", data: { url: activeTabUrl } }, (response) => {
            //요청 전송 후 할 일
            const date = new Date();
            if (response.data === null) {
                //에러 발생
                log.innerText = `GPT 요청 실패: ${response.message}`;
            }
            else {
                log.innerText = date.toString() + ": gpt 키워드추출 요청 완료";

                //방문기록 새로고침
                const selected = dropdown.value;
                loadHistoryData(selected);
            }
        })

    });
})

//새로고침 버튼
const historyRefreshButton = document.getElementById("history-refresh-button");
historyRefreshButton.addEventListener('click', () => {
    const selected = dropdown.value;
    loadHistoryData(selected);
})