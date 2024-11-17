import { messageHandler } from "./service-worker/messageHandler.js";
import { tabActivationHandler, windowFocusChangeHandler } from "./service-worker/tabFocusManager.js";
import { loginHandler } from "./service-worker/loginHandler.js";
import { logoutHandler } from "./service-worker/logoutHandler.js";

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

// chrome.webRequest.onCompleted.addListener(loginHandler,
//     {
//         urls: ["https://capstonepractice.site/api/auth/oauth2/google"],
//     },
//     ["responseHeaders"]
// );


