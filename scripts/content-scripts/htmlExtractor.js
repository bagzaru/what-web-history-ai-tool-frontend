//html 데이터 추출
//3. 데이터 추출:
//서비스 워커에서 'EXTRACT_PAGE' 메시지를 받으면, 페이지의 HTML을 추출하여 응답한다.
chrome.runtime.onMessage.addListener((message, sender, sendResponse) => {
    if (message.action === "EXTRACT_PAGE_DATA") {
        const data = {
            title: document.title,
            url: window.location.href,
            content: document.querySelector("body").innerText
        }
        sendResponse({ data: data });

        return false;
    }
    return false;
})