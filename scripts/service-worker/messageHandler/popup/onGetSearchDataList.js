import networkManager from "../../networking/networkManager.js";

const onGetSearchDataList = {
    senderName: "popup",
    eventName: "GET_SEARCH_DATA_LIST",

    listener: async function (message, sender) {
        //popup에서 전체 데이터 리스트를 요청했을 때
        console.log("GET_SEARCH_DATA_LIST: 데이터 요청" + JSON.stringify(message.data));

        const startDate
            = (message.startDate !== undefined || message.data.startDate !== "")
                ? new Date(message.data.startDate)
                : new Date(2000, 0, 1);
        startDate.setHours(0, 0, 0, 0);
        const endDate
            = (message.endDate !== undefined || message.data.endDate !== "")
                ? new Date(message.data.endDate)
                : new Date();
        endDate.setHours(23, 59, 59, 999);

        console.log("GET_SEARCH_DATA_LIST: 수정된 start-end Date" + startDate + " ~ " + endDate);
        const domain = message.data.domain;
        const query = message.data.query;
        const category = "";

        const searchData = await networkManager.post.search(startDate, endDate, query, domain, category);

        console.log("GET_SEARCH_DATA_LIST: 데이터 요청 성공");
        return { data: searchData };
    }
}

export default onGetSearchDataList;
