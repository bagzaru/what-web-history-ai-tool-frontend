import networkManager from "../../networking/networkManager.js";

const onGetDetailData = {
    senderName: "popup",
    eventName: "GET_DETAIL_DATA",

    listener: async function (message, sender) {
        //popup.js에서 detail data 요청이 있었을 때
        console.log("POPUP: GET_DETAIL_DATA 요청. 해당 데이터 id:" + message.data);
        const id = message.data;
        if (id === undefined) {
            console.log("데이터 요청 실패: id 값 없음");
            return { data: null };
        }
    
        const data = await networkManager.get.getHistoryById(id)

        console.log("GET_DETAIL_DATA: 데이터 요청 성공");
        return { data: data };
    }
}

export default onGetDetailData;