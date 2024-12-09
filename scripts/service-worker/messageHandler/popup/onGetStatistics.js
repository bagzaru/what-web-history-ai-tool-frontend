import networkManager from "../../networking/networkManager.js";

const onGetStatistics = {
    senderName: "popup",
    eventName: "GET_STATISTICS",

    listener: async function (message, sender) {
        //popup에서 전체 데이터 리스트를 요청했을 때
        console.log("GET_STATISTICS: 데이터 요청" + JSON.stringify(message.data));

        const k = (message.data.k !== undefined) ? message.data.k : 7;

        const endDate
            = (message.endDate !== undefined || message.data.endDate !== "")
                ? new Date(message.endDate)
                : new Date();
        const startDate
            = (message.startDate !== undefined || message.data.startDate !== "")
                ? new Date(message.startDate)
                : new Date(endDate.getFullYear(), endDate.getMonth(), endDate.getDate() - 7);
        startDate.setHours(0, 0, 0, 0);
        endDate.setHours(23, 59, 59, 999);
        console.log("GET_STATSTICS: 수정된 start-end Date: " + startDate + " ~ " + endDate);

        if (message.data.type === "category") {
            const searchData = await networkManager.get.getBestCategory(k, startDate, endDate);
            console.log("GET_STATISTICS:category: 데이터 요청 성공");
            return { data: searchData };
        }
        else if (message.data.type === "domain") {
            const searchData = await networkManager.get.getBestDomain(k, startDate, endDate);
            console.log("GET_SEARCH_DATA_LIST:domain: 데이터 요청 성공");
            return { data: searchData };
        } else {
            throw new Error("GET_STATISTICS: type이 잘못되었습니다.");
        }
    }
}

export default onGetStatistics;
