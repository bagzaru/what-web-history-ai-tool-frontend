import networkManager from "../../networking/networkManager.js";

//deprecated: 프로토타입 코드

const onNetworkStateChanged = {
    senderName: "popup",
    eventName: "NETWORK_STATE_CHANGED",

    listener: async function (message, sender) {
        //popup.js에서 history load 요청이 있었을 때
        console.warn("{*deprecated*}: POPUP: networkStateChanged 요청");

        //popup에서 serverState값이 바뀌었을 때에 대한 대응
        networkManager.setNetworkState(message.data);

        console.log("server State changed: " + message.data);
        return ({ data: message.data });
    }
}

export default onNetworkStateChanged;