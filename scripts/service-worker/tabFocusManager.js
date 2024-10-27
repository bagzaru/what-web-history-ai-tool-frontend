//tabFocusManager.js: 탭의 포커스 상태를 체크한다.
// - 해당 탭 또는 창의 체류 시간을 체크하기 위해, tab이나 windows의 focus 상태를 조사하여 포커스 종료, 포커스 시작 상태에 대한 처리를 한다.
// - 크롬에서는 탭과 창의 이벤트가 별개로 일어나기 때문에, 탭, 창 모두에 대한 이벤트를 확인해주어야 한다. 각 이벤트가 동시에 일어나거나, 둘 중 하나만 일어나는 경우에 대한 처리를 진행한다.
import networkManager from "./networkManager.js";

const tabFocusManager = {
    currentFocus: {
        tabId: -1,
        url: "",
        startTime: (new Date()).getTime()
    },

    updateFocus: function ({ tabId = -1, url = "", startTime = "" }) {
        //1. currentFocus와 같은 url이라면, 중복해서 온 이벤트이므로 처리x
        // - 또는 현재와 다른 탭에 같은 url일 수도 있긴 하지만, 현재 로직상 차이가 없으므로 무시한다.
        //2. currentFocus와 다른 url이라면, 기존 값 전송 및 현재 값으로 갱신
        //3. url이 ""이라면, focus가 나갔으므로 기존 값 전송 및 ""으로 갱신 (2와 동시에 처리가능)
        //4. 기존 url이 ""이라면 focus가 없었으므로 값만 갱신

        if (this.currentFocus.url === url) {
            return false;
        }

        //현재 시간 값 적용하여 서버에 전송
        //보낼 값이 없을 경우에는 전송하지 않는다.
        if (this.currentFocus.url !== "") {
            const toSend = {
                ...this.currentFocus,
                endTime: (new Date()).getTime()
            }
            console.log("Old Focus Sended: " + toSend.url + ", time: " + (toSend.endTime - toSend.startTime));
            networkManager.put.updateHistory(toSend);
        }
        this.currentFocus = {
            ...this.currentFocus,
            tabId: tabId,
            url: url,
            startTime: startTime
        }

        console.log("Current Focus Updated: " + this.currentFocus.url);
        return true;
    }
}

async function windowFocusChangeHandler(windowId) {
    //크롬 창의 focus 상태가 변화하면 spentTimeManager의 focus값을 업데이트한다.
    if (windowId !== chrome.windows.WINDOW_ID_NONE) {
        const tabs = await chrome.tabs.query({ active: true, currentWindow: true });
        //console.log(`Win Focus 이벤트 결과 - 새 탭이 존재하므로, 새 포커스 탭 갱신: url:${tabs[0].url}:`)
        const focus = {
            tabId: tabs[0].id,
            url: tabs[0].url,
            startTime: (new Date()).getTime()
        }
        tabFocusManager.updateFocus(focus);
    }
    else {
        // Window id가 none이므로, 크롬에서 벗어남을 의미함.
        const focus = {
            tabId: -1,
            url: "",
            startTime: (new Date()).getTime()
        }
        tabFocusManager.updateFocus(focus);
    }
}

async function tabActivationHandler(activeInfo) {
    //last focused 데이터를 갱신한다.
    const tabInfo = await chrome.tabs.get(activeInfo.tabId);
    const focus = {
        tabId: activeInfo.tabId,
        url: tabInfo.url,
        startTime: (new Date()).getTime()
    }
    tabFocusManager.updateFocus(focus);
}

export { tabFocusManager, windowFocusChangeHandler, tabActivationHandler };


//테스트 케이스
// 1. 탭 사용 중 다른 탭 누르기
// 2. 탭 사용 중 다른 페이지로 넘어가기 -----
// 3. 탭 사용 중 다른 크롬창 누르기
// 4. 탭 사용 중 다른 크롬창의 다른 탭 누르기
// 5. 탭 사용 중 아예 다른 프로그램 누르기
// 6. 다른 프로그램 사용 중 크롬 창 누르기
// 7. 다른 프로그램 사용 중 다른 탭 누르기
// 8. 다른 프로그램 사용 중 다른 페이지 url 누르기 -----