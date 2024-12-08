import { domLoadHandler as tabFocusManagerEvent } from "../../tabFocusManager.js";
import networkManager from "../../networking/networkManager.js";

const onDOMLoaded = {
    senderName: "domReadyHandler",
    eventName: "DOM_LOADED",
    listener: async function (message, sender) {
        console.log("service-worker/onDOMLoaded/");

        const extractorMessage = {
            receiverName: "contentExtractor",
            action: "EXTRACT_CONTENT",
            data: {}
        };
        const extractorResponse = await chrome.tabs.sendMessage(sender.tab.id, extractorMessage);

        let dataToSend = {
            title: extractorResponse.data.title,
            url: extractorResponse.data.url,
            content: extractorResponse.data.htmlContent
        };

        if (dataToSend.content.length >= 30000) {
            console.log("messageHandler: onDOMLoaded: 30,000자 초과. textContent로 변경");
            dataToSend.content = extractorResponse.data.textContent;
        }
        if (dataToSend.content.length >= 200000) {
            //DOM Distiller에 요청
            console.log("messageHandler: onDOMLoaded: 200,000자 초과. DOM Distiller로 변경");
        }

        //tabFocusManager의 url 업데이트함
        tabFocusManagerEvent(sender.tab.id, message.data.url);

        //만약 autoSave가 켜져있을 경우, 페이지 데이터를 서버에 전송
        const isSettingAutoSaveOn = await chrome.storage.sync.get(["settingAutoSave"]);
        console.log("isettingautosaveon:", isSettingAutoSaveOn);

        if (isSettingAutoSaveOn.settingAutoSave) {
            //자동 저장이 켜져있을 경우
            console.log("DOM_LOADED: autoSave 켜져있음");

            const saveHistoryResponse = await networkManager.post.saveHistory(dataToSend);

            console.log("DOM_Loaded: savePageData: 데이터 추출 완료: " + JSON.stringify(saveHistoryResponse));
            return { data: saveHistoryResponse };
        }

        return {};
    }
}









//DOM Distiller를 통해 요약된 데이터 추출
/*chrome.tabs.sendMessage(
    sender.tab.id,
    { action: "DOM_DISTILLER_EXTRACT", data: {} },
    (response) => {
        if (response === undefined) {
            console.log("issue#3 문제 발생, URL: " + message.data.url + ", 탭 id: " + sender.tab.id);
        }
        else if (response.data !== undefined) {
            //DOM Distiller에 오류가 없었을 경우
            data.title = response.data.title;
            data.content = response.data.content;
        }
        console.log("DOM extracted");
        //console.log("원본: " + message.data.pageData);
        //console.log("Sending Data title:" + data.title + ", content: " + data.content);

        //텍스트 데이터를 서버에 전송
        networkManager.post.saveHistory(data)
            .then(async () => {
                try {
                    //24.10.16: 현재 자동 키워드 추출 사용하지 않음(비용 문제)
                    // - 실제 릴리즈 시에는 사용할 예정
                    //await server.put.extractKeywords(data.url);
                    //console.log("extractKeywords 성공적");
                }
                catch (e) {
                    console.log(`extractKeywords error: ${e.message}`);
                }
            })
            .catch((e) => {
                console.log(`saveHistory Error: ${e.message}`);
            });
    });*/

//TODO: Distiller를 사용하는 경우와 사용하지 않는 경우 나누기


export default onDOMLoaded;