import networkManager from "../../networking/networkManager.js";

const onDeleteData = {
    senderName: "popup",
    eventName: "DELETE_HISTORY_DATA",

    listener: async function (message, sender) {
        //popup에서 데이터 삭제를 요청했을 때
        const url = `${message.data}`;
        console.log("DELETE_HISTORY_DATA: 데이터 삭제 요청" + url);


        const response = await networkManager.del.deleteHistory(url);

        console.log("DELETE_HISTORY_DATA: 데이터 삭제 성공");
        return { data: response };
    }
}

export default onDeleteData;
