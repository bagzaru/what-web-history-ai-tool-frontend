//html 데이터 추출

function extractHTMLText() {
    //TODO: 전체 html을 뽑는것, innerText만 뽑는 것, DOM Distiller를 이용한 것 중에 어떤 것이 정확한 결과에 가까운가?
    const bodyHTML = document.body.outerHTML;

    console.log("추출됨: " + bodyHTML);
    return bodyHTML;
}

//3. 데이터 추출:
//서비스 워커에서 'EXTRACT_PAGE' 메시지를 받으면, 페이지의 HTML을 추출하여 응답한다.
chrome.runtime.onMessage.addListener((message, sender, sendResponse) => {
    if (message.action === "EXTRACT_PAGE_DATA") {

        const extractedPage = extractHTMLText();
        console.log("is this fucking work????");
        sendResponse({ data: extractedPage });

        return false;
    }
    return false;
})