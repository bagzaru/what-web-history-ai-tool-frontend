//탭의 포커스를 체크한다.
import networkManager from "./networkManager.js";

//마지막으로 focus되어있던 탭. 탭이 닫히면 startTime을 이용하여 체류 시간을 계산하고 서버에 전송한다.
// url이 ""일 경우 마지막으로 focus되어있던 탭이 없거나, 이미 서버로 전송했음을 의미한다.
let lastFocused = {
    tabId: -1,
    url: "*init url*",
    startTime: (new Date()).getTime()
};

//lastFocused값을 초기화하고, 전송을 위한 데이터를 반환받음.
function popLastFocused() {
    const toSend = { ...lastFocused, endTime: (new Date()).getTime() };
    lastFocused = {
        ...lastFocused,
        tabId: -1,
        url: "",
        startTime: (new Date()).getTime()
    }
    return toSend;
}

//윈도우 포커스 이벤트 리스너
async function windowFocusChangeHandler(windowId) {
    //크롬 창의 focus 상태가 변화하면 lastFocused 값을 초기화하고 서버로 전송한다.

    //1. 창의 focus 상태가 변화하면 lastFocused 값 초기화, 기존 값은 보관해둠
    //  - tab event나 다른 window event가 동시에 일어날 수 있다. 하지만 put(서버전송)과 tabs.query는 비동기함수이기에 시간이 걸리므로 두 이벤트 콜백 함수 간 race condition 문제가 발생할 수 있다. 따라서 시작하자마자 lastFocused값을 초기화하고 해당 값을 저장해둔다.
    //  - lastFocused값을 초기화함으로써, tab activation 이벤트에서 중복으로 전송하는 것도 방지할 수 있다.
    //2. 이후 켜진 tabs.query를 수행하여 lastFocused값을 갱신하고, 서버로 전송한다.

    //포커스 값 초기화
    const toSend = popLastFocused();

    //Win focus 이벤트가 발생했는데, 현재 activation인 탭이 있다면 focus가 새로 시작된 것이므로 현재 탭의 정보를 쿼리하여 저장한다.
    if (windowId !== chrome.windows.WINDOW_ID_NONE) {
        const tabs = await chrome.tabs.query({ active: true, currentWindow: true });
        console.log(`Win Focus 이벤트 결과 - 새 탭이 존재하므로, 새 포커스 탭 갱신: url:${tabs[0].url}:`)
        lastFocused = {
            ...lastFocused,
            tabId: tabs[0].id,
            url: tabs[0].url,
            startTime: (new Date()).getTime()
        }
    }

    //lastFocused를 pop한 결과가 비어있다면, 동시에 발생한 다른 이벤트에서 먼저 확인 후 처리중이라는 이야기므로 처리하지 않는다.
    if (toSend.url === "")
        return;
    console.log(`Win Focus 이벤트 발생, 체류시간: ${toSend.endTime - toSend.startTime}, last url: ${toSend.url}`);



    //lastFocused 값이 존재했었다면, 서버로 해당 데이터 전송
    if (toSend.url !== "*init url*")
        networkManager.put.updateHistory(toSend);
}

//tabActivation 이벤트리스너
async function tabActivateHandler(activeInfo) {
    //last Focused 값 가져오고 초기화
    const toSend = popLastFocused();

    //last focused 데이터를 갱신한다.
    const tabInfo = await chrome.tabs.get(activeInfo.tabId);
    lastFocused = {
        ...lastFocused,
        tabId: activeInfo.tabId,
        url: tabInfo.url,
        startTime: (new Date()).getTime()
    }

    //lastFocused를 pop한 결과가 비어있다면, 동시에 발생한 다른 이벤트에서 먼저 확인 후 처리중이라는 이야기므로 처리하지 않는다.
    if (toSend.url === "")
        return;

    console.log(`Tab Activate 이벤트 발생, 체류 시간: ${toSend.endTime - toSend.startTime}, 직전 tab: ${toSend.url}:`);

    //이전 값을 서버로 보낸다.
    if (toSend.url !== "*init url*")
        networkManager.put.updateHistory(toSend);

}

export { tabActivateHandler, windowFocusChangeHandler };