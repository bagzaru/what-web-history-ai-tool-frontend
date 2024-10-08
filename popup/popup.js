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

const popupText = document.querySelector('#popupText');
const logText = document.querySelector('#debugLog');

popupText.innerText = '쿠구궁...';

chrome.runtime.sendMessage({ type: '' }, (response) => {
    popupText.innerText = response.text;
});

chrome.storage.local.get(['localHistoryDB'], (result) => {
    if (result.localHistoryDB) {
        logText.innerText = result.localHistoryDB.map((x) => x.title).join('\n');
    }
    else {
        logText.innerHTML = "데이터 탐색 실패";
    }
})