import { domLoadHandler as tabFocusManagerEvent } from "../../tabFocusManager.js";
import networkManager from "../../networking/networkManager.js";
import { loadPageContent } from "../../pageContentLoader.js";

const onDOMLoaded = {
    senderName: "domReadyHandler",
    eventName: "DOM_LOADED",
    listener: async function (message, sender) {
        console.log("service-worker/onDOMLoaded/");

        //tabFocusManager의 탭 체류 상태 업데이트
        tabFocusManagerEvent(sender.tab.id, message.data.url);

        //페이지 데이터 로드
        const pageContentData = await loadPageContent(sender.tab.id);

        //만약 autoSave가 켜져있을 경우, 페이지 데이터를 서버에 전송
        const isSettingAutoSaveOn = (await chrome.storage.sync.get(["settingAutoSave"])).settingAutoSave;

        console.log("DOM_LOADED: autoSave: " + JSON.stringify(isSettingAutoSaveOn));
        if (isSettingAutoSaveOn === true) {
            //자동 저장이 켜져있을 경우 서버 전송
            const saveHistoryResponse = await networkManager.post.saveHistory(pageContentData);

            console.log("DOM_Loaded: 데이터 전송 완료 " + JSON.stringify(saveHistoryResponse));
            return { data: saveHistoryResponse };
        }
        return { data: "good" };
    }
}

export default onDOMLoaded;