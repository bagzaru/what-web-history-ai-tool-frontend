import { post, put, get } from "./networking/RestAPI.js";
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
            if (getServerState() === false) throw new Error(`현재 오프라인 모드입니다. serverState: false`);

            const path = "/api/history";
            const fullPath = getFullPath(defaultHost, path);
            const body = createHistoryBody(title, content, url, 0, getJavaDateString(new Date()));

            //console.log(`post 준비 완료, body: ${JSON.stringify(body)}`);

            const data = await post(fullPath, body);

            //TODO: 반환된 id값 저장하기
            console.log(`POST: saveHistory 완료, 반환된 값: ${JSON.stringify(data)}`);

            //visitTime, content

            return data;
        }
    },
    put: {
        updateHistory: async function ({ tabId, url, startTime, endTime }) {
            if (getServerState() === false) throw new Error(`현재 오프라인 모드입니다. serverState: false`);

            //서버로 전송하여 해당 url의 체류 시간을 업데이트한다.
            const spentTime = endTime - startTime;

            //해당 url의 id를 확인한다. 체크한다.

            console.log(`PUT: url: ${url}, 머문 시간: ${spentTime} `)

            const path = '/api/history';
            // const body = {
            //     url: url,
            //     spentTime: spentTime,
            // };
            const body = new FormData();
            body.append("url", url);
            body.append("spentTime", spentTime);

            const fullPath = getFullPath(defaultHost, path);

            put(fullPath, body);
        },

        extractKeywords: async function (url) {
            if (getServerState() === false) throw new Error(`현재 오프라인 모드입니다. serverState: false`);


            // const body = {
            //     url: url
            // };

            const path = '/api/history/keyword';

            const body = new FormData();
            body.append('url', url);

            console.log("extractKeywords: url:" + url);
            const fullPath = getFullPath(defaultHost, path);

            const data = await put(fullPath, body);


            //TODO: 반환된 id값 저장하기
            console.log(`PUT: extractKeywords 완료, 반환된 값: ${JSON.stringify(data)}`);

            return data;
        }
    },
    get: {
        getHistoryByDate: async function (orderBy) {
            if (getServerState() === false) throw new Error(`현재 오프라인 모드입니다. serverState: false`);

            //TODO: 기간 외부에서 입력받기
            const curTime = new Date();
            const startTime = new Date();
            startTime.setDate(curTime.getDate() - 7);

            //const path = '/api/history';
            // const body = {
            //     startTime: getJavaDateString(startTime),
            //     endTime: getJavaDateString(curTime)
            // };

            const path = '/api/history' + '?' + 'startTime=' + getJavaDateString(startTime) + '&' + 'endTime=' + getJavaDateString(curTime) + '&orderBy=' + orderBy;
            const body = {};

            // const body = new FormData();
            // body.append('startTime', getJavaDateString(startTime));
            // body.append('endTime', getJavaDateString(curTime));

            const fullPath = getFullPath(defaultHost, path);
            console.log("getHistoryByDate: 쿼리스트링: " + fullPath);
            const data = await get(fullPath, body);


            //TODO: 반환된 id값 저장하기
            console.log(`GET: getHistoryByDate 완료, 반환된 값: ${JSON.stringify(data)}`);

            return data;
        },
        getHistoryByDateAndKeyword: function () {
            if (getServerState() === false) throw new Error(`현재 오프라인 모드입니다. serverState: false`);

        },
        getKeywordFrequency: async function () {
            if (getServerState() === false) throw new Error(`현재 오프라인 모드입니다. serverState: false`);

        },
        getTotalSpentTime: function () {
            if (getServerState() === false) throw new Error(`현재 오프라인 모드입니다. serverState: false`);

        }
    },
    del: {
        deleteHistory: function () {
            if (getServerState() === false) throw new Error(`현재 오프라인 모드입니다.`);

        }
    }
}

export default server;