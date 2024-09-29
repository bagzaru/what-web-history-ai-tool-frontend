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