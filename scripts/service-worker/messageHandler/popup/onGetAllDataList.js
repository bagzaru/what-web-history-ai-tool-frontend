import networkManager from "../../networking/networkManager.js";

const onGetAllDataList = {
    senderName: "popup",
    eventName: "GET_ALL_DATA_LIST",

    listener: async function (message, sender) {
        //popup.js에서 all data list 요청이 있었을 때
        console.log("POPUP: GET_ALL_DATA_LIST 요청");

        //popup에서 전체 데이터 리스트를 요청했을 때
        // 기본 변수 값
        const defaultStartDate = new Date(2000, 0, 1);
        const defaultEndDate = new Date();
        const defaultOrderBy = "visitTime";
        const defaultSortOrder = "desc";
        const defaultPage = 0;
        const defaultSize = 10;
        const defaultDomain = '';
        const defaultCategory = '';

        console.log("queries:", message.queries);    
        const queries = message.queries || {};

        let startDate = new Date(queries.startTime || defaultStartDate);
        let endDate = new Date(queries.endTime || defaultEndDate);
        let domain = queries.domain || defaultDomain;
        let category = queries.category || defaultCategory;
        let page = queries.page || defaultPage;
        let size = queries.size || defaultSize;
        let orderBy = queries.sortBy || defaultOrderBy;
        let sortOrder = queries.sortOrder || defaultSortOrder;
        startDate.setHours(0, 0, 0, 0);
        endDate.setHours(23, 59, 59, 999);
        console.log("GET_ALL_DATA_LIST: 수정된 start-end Date: " + startDate + " ~ " + endDate);

        const data = await networkManager.get.getHistories(orderBy, startDate, endDate, page, size, sortOrder, domain, category);

        console.log("GET_ALL_DATA_LIST: 데이터 요청 성공");
        return { data: data };
    }
}

export default onGetAllDataList;