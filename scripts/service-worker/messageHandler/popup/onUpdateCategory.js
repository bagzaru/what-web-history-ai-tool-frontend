import networkManager from "../../networking/networkManager.js";

const onUpdateCategory = {
    senderName: "popup",
    eventName: "UPDATE_CATEGORY",

    listener: async function (message, sender) {
        //popup에서 데이터 업데이트를 요청했을 때
        console.log("UPDATE_CATEGORY: 카테고리 수정 요청" + JSON.stringify(message.data));

        if ((!message.data.originalName) || (!message.data.newName)) {
            console.log("필수 데이터 없음");
            return { data: null };
        }
        
        const response = await networkManager.put.updateCategory(message.data);

        console.log("UPDATE_CATEGORY: 카테고리 수정 성공");
        return { data: response };
    }
}

export default onUpdateCategory;
