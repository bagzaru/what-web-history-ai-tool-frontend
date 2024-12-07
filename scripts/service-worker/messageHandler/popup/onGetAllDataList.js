import networkManager from "../../networking/networkManager.js";

const onGetAllDataList = {
    senderName: "popup",
    eventName: "GET_ALL_DATA_LIST",

    listener: async function (message, sender) {
        //popup.js에서 all data list 요청이 있었을 때
        console.log("POPUP: GET_ALL_DATA_LIST 요청");

        //popup에서 전체 데이터 리스트를 요청했을 때
        const startDate = new Date(2000, 0, 1);
        const endDate = new Date();

        const data = await networkManager.get.getHistories("visitTime", startDate, endDate);

        console.log("GET_ALL_DATA_LIST: 데이터 요청 성공");
        return { data: data };
    }
}

export default onGetAllDataList;