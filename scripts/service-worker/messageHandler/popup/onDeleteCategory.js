import networkManager from "../../networking/networkManager.js";

const onDeleteCategory = {
    senderName: "popup",
    eventName: "DELETE_CATEGORY",

    listener: async function (message, sender) {
        //popup에서 전체 카테고리 목록을 요청했을 때
        console.log("DELETE_CATEGORY: 카테고리 삭제 요청");

        if (!message.data){
            console.log('필수값 없음');
            return { data: null };
        }
        const categoryName = message.data;
        
        const response = await networkManager.del.deleteCategory(categoryName);

        console.log("DELETE_CATEGORY: 카테고리 삭제 요청 완료");
        return { data: response };
    }
}

export default onDeleteCategory;
