import networkManager from "./networking/networkManager.js";

async function loadPageContent(tabId) {
    //content script에서 데이터 추출 요청 & 서버 전송
    //contentExtractor에 데이터 추출 요청
    const extractorMessage = {
        receiverName: "contentExtractor",
        action: "EXTRACT_CONTENT",
        data: {}
    };
    const extractorResponse = await chrome.tabs.sendMessage(tabId, extractorMessage);

    let pageContentData = {
        title: extractorResponse.data.title,
        url: extractorResponse.data.url,
        content: extractorResponse.data.htmlContent
    };

    //만약 content가 30,000자 이상일 경우, textContent로 변경
    if (pageContentData.content.length >= 30000) {
        console.log(`messageHandler: onDOMLoaded: 30,000자 초과${pageContentData.content.length}. textContent로 변경`);
        pageContentData.content = extractorResponse.data.textContent;
        console.log("textContent 변경 후 길이: " + pageContentData.content.length);
    }
    //만약 content가 200,000자 이상일 경우, DOM Distiller로 변경
    if (pageContentData.content.length >= 200000) {
        //DOM Distiller에 요청
        console.log("messageHandler: onDOMLoaded: 200,000자 초과. DOM Distiller로 변경");

        const distillerMessage = {
            receiverName: "domDistiller",
            action: "EXTRACT_CONTENT",
            data: {}
        };

        //DOM Distiller를 통해 요약된 데이터 추출
        const response = await chrome.tabs.sendMessage(tabId, distillerMessage);

        if (response === undefined) {
            console.log("DOM Disstiller 추출 실패! URL: " + message.data.url + ", 탭 id: " + tabId);
        }
        else if (response.data !== undefined) {
            //DOM Distiller에 오류가 없었을 경우
            console.log("DOM extracted, 글자 수: " + response.data.content.length);
            pageContentData.title = response.data.title;
            pageContentData.content = response.data.content;
        }
    }

    console.log("service-worker: pageContentLoader: 데이터 로드 완료: " + JSON.stringify(pageContentData));
    return pageContentData;
}

export { loadPageContent };