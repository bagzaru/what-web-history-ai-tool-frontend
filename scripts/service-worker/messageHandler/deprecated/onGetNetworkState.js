import networkManager from "../../networking/networkManager";

//deprecated: 프로토타입 코드

const onGetNetworkState = {
    senderName: "popup",
    eventName: "GET_NETWORK_STATE",

    listener: async function (message, sender) {
        //popup.js에서 history load 요청이 있었을 때
        console.warn("{*deprecated*}: POPUP: getNetworkState 요청");

        //popup이나 content에서 서버 state가 알고싶다고 요청할 때
        return { data: networkManager.getNetworkState() };
    }
}

export default onGetNetworkState;