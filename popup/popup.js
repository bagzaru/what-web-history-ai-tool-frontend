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

    //서버 데이터 받아오기

}

