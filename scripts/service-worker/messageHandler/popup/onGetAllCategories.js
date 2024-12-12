import networkManager from "../../networking/networkManager.js";

const onGetAllCategories = {
    senderName: "popup",
    eventName: "GET_ALL_CATEGORIES",

    listener: async function (message, sender) {
        //popup에서 전체 카테고리 목록을 요청했을 때
        console.log("GET_ALL_CATEGORIES: 전체 카테고리 요청");


        const response = await networkManager.get.getCategories();

        console.log("GET_ALL_CATEGORIES: 전체 카테고리 요청 완료");
        return { data: response };
    }
}

export default onGetAllCategories;
