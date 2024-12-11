import networkManager from "../../networking/networkManager.js";

const onUpdateData = {
    senderName: "popup",
    eventName: "UPDATE_HISTORY_DATA",

    listener: async function (message, sender) {
        //popup에서 데이터 업데이트를 요청했을 때
        console.log("UPDATE_HISTORY_DATA: 데이터 업데이트 요청" + JSON.stringify(message.data));

        if ((!message.data.url) || (!message.data.category) || (message.data.category === '변경안함')) {
            console.log("필수 데이터 없음");
            return { data: null };
        }


        const response = await networkManager.put.updateHistoryData(message.data);

        console.log("UPDATE_HISTORY_DATA: 데이터 업데이트 성공");
        return { data: response };
    }
}

export default onUpdateData;
