import networkManager from "../../networking/networkManager.js";

const onAddCategory = {
    senderName: "popup",
    eventName: "ADD_CATEGORY",

    listener: async function (message, sender) {
        //popup에서 전체 카테고리 목록을 요청했을 때
        console.log("ADD_CATEGORY: 카테고리 추가 요청");

        if (!message.data){
            console.log('필수값 없음');
            return { data: null };
        }
        const categoryName = message.data;
        
        const response = await networkManager.post.addCategory(categoryName);

        console.log("ADD_CATEGORY: 카테고리 추가 요청 완료");
        return { data: response };
    }
}

export default onAddCategory;