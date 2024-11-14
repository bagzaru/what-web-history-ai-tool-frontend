//html 데이터 추출

function extractHTMLText() {
    //TODO: 전체 html을 뽑는것, innerText만 뽑는 것, DOM Distiller를 이용한 것 중에 어떤 것이 정확한 결과에 가까운가?
    const bodyHTML = document.body.outerHTML;

    console.log("추출됨: " + bodyHTML);
    return bodyHTML;
}

chrome.runtime.onMessage.addListener((message, sender, sendResponse) => {
    if (sender.tab) {
        //content script가 보냈으므로 out
    }
    if (message.action === "EXTRACT_PAGE") {
        const extractedPage = extractHTMLText();
        console.log("is this fucking work????");
        sendResponse({ data: extractedPage });
    }
    console.log("bb");
    return false;

})