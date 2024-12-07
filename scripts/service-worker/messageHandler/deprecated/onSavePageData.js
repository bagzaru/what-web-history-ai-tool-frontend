import networkManager from "../../networking/networkManager";

//deprecated: 프로토타입 코드

const onSavePageData = {
    senderName: "popup",
    eventName: "SAVE_PAGE_DATA",

    listener: async function (message, sender) {
        //popup.js에서 history load 요청이 있었을 때
        console.warn("{*deprecated*}: POPUP: SAVE_PAGE_DATA 요청");

        return { data: null };
    }
}

export default onSavePageData;