import { logoutHandler } from "../scripts/service-worker/logoutHandler.js";

//주요 element들
const dropdown = document.getElementById('dropdown');
const table = document.getElementById('keyword-table').getElementsByTagName('tbody')[0];
const log = document.getElementById('debugLog');

//popup이 켜졌을때 network state 상태 조회 후, 해당 값으로 html element를 초기화해둠 
chrome.runtime.sendMessage({ action: "GET_NETWORK_STATE" }, (response) => {
    if (response.data === true) {
        document.querySelector("#radio-on").checked = "checked";
    }
    else {
        document.querySelector("#radio-off").checked = "checked";
    }
});

//network state 설정 관련 element에 이벤트리스너 장착
window.onload = function () {
    document.querySelector("#radio-on")
        .addEventListener('change', (event) => {
            if (event.target.checked) {
                //서버 연결 시작
                chrome.runtime.sendMessage({ action: "NETWORK_STATE_CHANGED", data: true }, (response) => {
                    const selected = document.getElementById('dropdown').value;
                    loadHistoryData(selected);
                });
            }
        });
    document.querySelector("#radio-off")
        .addEventListener('change', (event) => {
            if (event.target.checked) {
                //서버 연결 끊기                
                chrome.runtime.sendMessage({ action: "NETWORK_STATE_CHANGED", data: false }, (response) => {
                    const selected = document.getElementById('dropdown').value;
                    loadHistoryData(selected);
                });
            }
        })
}

//popup이 켜졌을 때, history data 최신 정보로 로드 시도
loadHistoryData(dropdown.checked);

//표의 dropdown(정렬 기준)이 변경되면, histoyr data 최신 정보로 로드 시도
dropdown.addEventListener('change', function () {
    const selected = dropdown.value;
    loadHistoryData(selected);
})

//gpt 키워드 추출 요청 버튼의 이벤트 리스너 장착
const gptRequestButton = document.getElementById("gpt-request-button");
gptRequestButton.addEventListener('click', () => {
    //현재 페이지 어딘지 조회하여 보내기
    chrome.tabs.query({ active: true, currentWindow: true }, function (tabs) {
        const activeTab = tabs[0];
        const activeTabUrl = activeTab.url;

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

//방문기록 리스트 새로고침 버튼 관련 구현
const historyRefreshButton = document.getElementById("history-refresh-button");
historyRefreshButton.addEventListener('click', () => {
    const selected = dropdown.value;
    loadHistoryData(selected);
})

//서버로부터 방문기록 리스트 로드하여 popup.html에 주입하는 함수
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

    // const googleLoginButton = document.getElementById("google-login-button");
    // googleLoginButton.addEventListener('click', () => {
    //     const backendLoginUrl = "https://capstonepractice.site/oauth2/authorization/google";
    //     // 팝업 창을 열어 백엔드 로그인 url로 이동
    //     chrome.windows.create(
    //         {
    //             url: backendLoginUrl,
    //             type: "popup",
    //             width: 500,
    //             height: 700,
    //         }
    //       );
    // });

    // const showTokenButton = document.getElementById("show-token");
    // showTokenButton.addEventListener('click', () => {
    //     chrome.storage.local.get((result) => console.log(result));
    // });

    // const logoutButton = document.getElementById("logout-button");
    // logoutButton.addEventListener('click', async () => {
    //     await logoutHandler();
    // })
}