import { post, put } from "./networking/RestAPI.js";
import { createHistoryBody } from "./localhistory.js";
import getJavaDateString from "./date/javaDateConverter.js";

const defaultHost = "https://capstonepractice.site";

function getURLfromPath(path) {
    const url = /^https?:\/\//.test(path)
        ? path
        : `https://host/${path}`;
    return url;
}

function getFullPath(host, path) {
    if (typeof host === "string" && typeof path === "string") {
        if (path[0] == '/') {
            return host + path;
        }
        else {
            return host + '/' + path;
        }
    }
    else return "";
}

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


//서버와의 통신 모듈
const server = {
    getServerState: getServerState,
    setServerState: setServerState,
    post: {
        saveHistory: async function ({ title, url, content }) {
            if (getServerState() === false) return;

            const path = "/api/history";
            const fullPath = getFullPath(defaultHost, path);
            const body = createHistoryBody(title, content, url, 0, getJavaDateString(new Date()));

            //console.log(`post 준비 완료, body: ${JSON.stringify(body)}`);

            const data = await post(fullPath, body);

            //TODO: 반환된 id값 저장하기
            console.log(`POST: saveHistory 완료, 반환된 값: ${JSON.stringify(data)}`);

            //visitTime, content
        }
    },
    put: {
        updateHistory: async function ({ tabId, url, startTime, endTime }) {
            if (getServerState() === false) return;
            console.log("현재 updateHistory는 수리중");
            return;

            //서버로 전송하여 해당 url의 체류 시간을 업데이트한다.
            const spentTime = endTime - startTime;

            //해당 url의 id를 확인한다. 체크한다.

            console.log(`PUT: url: ${url}, 머문 시간: ${spentTime} `)

            const path = '/api/history/2';
            const body = {
                url: url,
                spentTime: spentTime,
            };
            const fullPath = getFullPath(defaultHost, path);

            put(fullPath, body);
        },

        extractKeywords: function () {
            if (getServerState() === false) return;

            console.log("extract 요청");

            const path = '/api/history/2/keyword';
            const body = {};
            const fullPath = getFullPath(defaultHost, path);

            put(fullPath, body);
        }
    },
    get: {
        getHistoryByDate: function () {

        },
        getHistoryByDateAndKeyword: function () {

        },
        getKeywordFrequency: function () {

        },
        getTotalSpentTime: function () {

        }
    },
    del: {
        deleteHistory: function () {

        }
    }
}

export default server;