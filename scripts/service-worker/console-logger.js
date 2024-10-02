import { MessageActions } from "../content/content-debugger.js";


function consoleLogOnCurrentTab(text) {
    chrome.tabs.query({ active: true, currentWindow: true }, (tabs) => {
        chrome.tabs.sendMessage(
            tabs[0].id,
            { action: MessageActions.LOG, data: text },
            (response) => { });
    });
}

export { consoleLogOnCurrentTab, MessageActions };