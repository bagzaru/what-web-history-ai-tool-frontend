let serverState = false;
let events = [];

function getServerState() {
    return serverState;
}

function setServerState(state) {
    if (serverState === true || serverState === false) {
        serverState = state;
        for (let f of events) {
            f(serverState);
        }
    }
    else {
        console.log("serverstate.js: setServerstate의 밸류로 이상한 값 들어옴");
    }
}

function addServerStateChangeListener(func) {
    events.push(func);
}

export { getServerState, setServerState, addServerStateChangeListener };

