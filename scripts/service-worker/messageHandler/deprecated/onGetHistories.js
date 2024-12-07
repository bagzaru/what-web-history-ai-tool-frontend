import networkManager from "../../networking/networkManager.js";

//deprecated: 프로토타입 코드

const onGetHistories = {
    senderName: "popup",
    eventName: "GET_HISTORIES",

    listener: async function (message, sender) {
        //popup.js에서 history load 요청이 있었을 때
        console.warn("{*deprecated*}: POPUP: getHistoryDate 요청");

        const histories = await networkManager.get.getHistories(message.data.orderBy)

        console.log("getHistoryDate 요청 성공");
        return { data: histories };
    }
}

export default onGetHistories;