import { domLoadHandler as tabFocusManagerEvent } from "../../tabFocusManager.js";
import networkManager from "../../networking/networkManager.js";

const onDOMLoaded = {
    senderName: "domReadyHandler",
    eventName: "DOM_LOADED",
    listener: async function (message, sender) {
        console.log("service-worker/onDOMLoaded/");

        //tabFocusManager의 탭 체류 상태 업데이트
        tabFocusManagerEvent(sender.tab.id, message.data.url);

        //content script에서 데이터 추출 요청 & 서버 전송
        //contentExtractor에 데이터 추출 요청
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

        //만약 content가 30,000자 이상일 경우, textContent로 변경
        if (dataToSend.content.length >= 30000) {
            console.log(`messageHandler: onDOMLoaded: 30,000자 초과${dataToSend.content.length}. textContent로 변경`);
            dataToSend.content = extractorResponse.data.textContent;
            console.log("textContent 변경 후 길이: " + dataToSend.content.length);
        }
        //만약 content가 200,000자 이상일 경우, DOM Distiller로 변경
        if (dataToSend.content.length >= 200000) {
            //DOM Distiller에 요청
            console.log("messageHandler: onDOMLoaded: 200,000자 초과. DOM Distiller로 변경");

            const distillerMessage = {
                receiverName: "domDistiller",
                action: "EXTRACT_CONTENT",
                data: {}
            };

            //DOM Distiller를 통해 요약된 데이터 추출
            const response = await chrome.tabs.sendMessage(sender.tab.id, distillerMessage);

            if (response === undefined) {
                console.log("DOM Disstiller 추출 실패! URL: " + message.data.url + ", 탭 id: " + sender.tab.id);
            }
            else if (response.data !== undefined) {
                //DOM Distiller에 오류가 없었을 경우
                console.log("DOM extracted, 글자 수: " + response.data.content.length);
                dataToSend.title = response.data.title;
                dataToSend.content = response.data.content;
            }
        }

        //만약 autoSave가 켜져있을 경우, 페이지 데이터를 서버에 전송
        const isSettingAutoSaveOn = (await chrome.storage.sync.get(["settingAutoSave"])).settingAutoSave;

        console.log("DOM_LOADED: autoSave: " + JSON.stringify(isSettingAutoSaveOn));
        if (isSettingAutoSaveOn === true) {
            //자동 저장이 켜져있을 경우 서버 전송
            const saveHistoryResponse = await networkManager.post.saveHistory(dataToSend);

            console.log("DOM_Loaded: savePageData: 데이터 추출 완료: " + JSON.stringify(saveHistoryResponse));
            return { data: saveHistoryResponse };
        }
        return {};
    }
}

export default onDOMLoaded;