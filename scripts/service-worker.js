import { messageHandler } from "./service-worker/messageHandler.js";
import { tabActivationHandler, windowFocusChangeHandler } from "./service-worker/tabFocusManager.js";
import { loginHandler } from "./service-worker/loginHandler.js";
import { logoutHandler } from "./service-worker/logoutHandler.js";
import { savePageData } from "./service-worker/savePageData.js";

console.log("service-worker on");

chrome.runtime.onMessage.addListener(messageHandler);
chrome.tabs.onActivated.addListener(tabActivationHandler);
chrome.windows.onFocusChanged.addListener(windowFocusChangeHandler);

//로그인 및 로그아웃을 위한 리스너
chrome.runtime.onMessage.addListener((request, sender, sendResponse) => {
    if (request.action === "LOGIN_REQUEST") {
        loginHandler().then((result) => {
            console.log("loginHandler result:", result);
            sendResponse({ data: result });
        }).catch((error) => {
            console.error("Error in loginHandler:", error);
            sendResponse({ data: false });
        });
        return true; // keep the messaging channel open for sendResponse
    }
    else if (request.action === "LOGOUT_REQUEST") {
        logoutHandler().then((result) => {
            console.log("logoutHandler result:", result);
            sendResponse({ data: result });
        }).catch((error) => {
            console.error("Error in logoutHandler:", error);
            sendResponse({ data: false });
        });
        return true; // keep the messaging channel open for sendResponse
    }
});

//웹페이지 우클릭 시 등장하는 컨텍스트 메뉴 생성
chrome.runtime.onInstalled.addListener(() => {
    chrome.contextMenus.create({
        id: "savePageData", // 고유 ID
        title: "페이지를 WHAT에 저장", // 메뉴에 표시될 텍스트
        contexts: ["all"], // 메뉴를 표시할 컨텍스트 (예: 페이지, 텍스트 선택 등)
    });
});

// 컨텍스트 메뉴 클릭 시 동작 정의
chrome.contextMenus.onClicked.addListener((info, tab) => {
    if (info.menuItemId === "savePageData") {
        // 메뉴 클릭 시 실행할 함수

        const onSaveFinished = (response) => {

            console.log("savePageData: 데이터 저장 완료");
        }
        const onSaveFailed = (e) => {
            console.error("savePageData: 데이터 저장 실패: " + e.message);
        }

        savePageData(tab.id, onSaveFinished, onSaveFailed);
    }
});

// chrome.webRequest.onCompleted.addListener(loginHandler,
//     {
//         urls: ["https://capstonepractice.site/api/auth/oauth2/google"],
//     },
//     ["responseHeaders"]
// );


