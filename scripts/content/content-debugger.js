import { MessageActions } from "../service-worker/console-logger";

function debugMessageHandler(message, sender, sendResponse) {
    if (message.action === MessageActions.LOG) {
        console.log("msg from background: " + message.data);
        sendResponse({ result: "good" });
    }
    sendResponse({ result: "undefined Message" });
}