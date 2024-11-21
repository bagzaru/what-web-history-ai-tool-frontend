import { post, put, get } from "./networking/RestAPI.js";
import { createHistoryRequestDTO } from "./networking/historyDTO.js";
import getJavaDateString from "./date/javaDateConverter.js";

//defaultHost: 기본 연결 서버 주소
const defaultHost = "https://capstonepractice.site";

//networkState: true일 때만 서버와의 통신 진행
let networkState = false;

//서버와의 통신 모듈
const networkManager = {
    getNetworkState: getNetworkState,
    setNetworkState: setNetworkState,
    post: {
        saveHistory: async function ({ title, url, content }) {
            if (getNetworkState() === false) throw new Error(`현재 오프라인 모드입니다. networkState: false`);
            //페이지 저장 요청이 오면, 해당 url과 방문시각을 서버에 전송하여 저장합니다.
            const path = "/api/history";
            const fullPath = getFullPath(defaultHost, path);
            const jsonBody = createHistoryRequestDTO(title, content, url);
            const stringBody = JSON.stringify(jsonBody);    //saveHistory는 json dto 형태로 주고받는다.

            const data = await post(fullPath, stringBody);
            console.log(`POST: saveHistory 완료: ${url}`);
            return data;
        }
    },
    put: {
        updateHistory: async function ({ tabId, url, startTime, endTime }) {
            if (getNetworkState() === false) throw new Error(`현재 오프라인 모드입니다. networkState: false`);

            //updateHistory: 해당 사이트의 체류 시간(visitTime)값을 업데이트합니다.

            //체류 시간 계산
            const spentTime = endTime - startTime;
            console.log(`PUT: url: ${url}, 머문 시간: ${spentTime} `)

            const path = '/api/history';
            // const body = {
            //     url: url,
            //     spentTime: spentTime,
            // };
            const body = new FormData();    //PUT: updatehistory의 body는 formdata 형식으로 주고받는다.
            body.append("url", url);
            body.append("spentTime", spentTime);

            const fullPath = getFullPath(defaultHost, path);

            put(fullPath, body);
        },

        extractKeywords: async function (url) {
            if (getNetworkState() === false) throw new Error(`현재 오프라인 모드입니다. networkState: false`);

            //extractKeywords: GPT에게 키워드 추출 요청을 보냅니다.

            const path = '/api/history/keyword';
            // const body = {
            //     url: url
            // };
            const body = new FormData();    //PUT: updatehistory의 body는 formdata 형식으로 주고받는다.
            body.append('url', url);
            const fullPath = getFullPath(defaultHost, path);

            console.log("extractKeywords 시도: url:" + url);
            const data = await put(fullPath, body);
            console.log(`PUT: extractKeywords 완료, 반환된 값: ${JSON.stringify(data)}`);

            return data;
        }
    },
    get: {
        getHistoryByDate: async function (orderBy) {
            if (getNetworkState() === false) throw new Error(`현재 오프라인 모드입니다. networkState: false`);

            //getHistoryByDate: 서버에서 방문기록 데이터를 최근 방문 순으로 가져옵니다.
            //TODO: 외부에서 기간을 지정받아, 해당 기간 내의 방문기록 데이터 가져오기

            const curTime = new Date();
            const startTime = new Date();
            startTime.setDate(curTime.getDate() - 7);

            const path = '/api/history' + '?';
            const queryString = 'startTime=' + getJavaDateString(startTime) + '&' + 'endTime=' + getJavaDateString(curTime) + '&orderBy=' + orderBy;
            const fullPath = getFullPath(defaultHost, path + queryString);

            console.log("getHistoryByDate 요청, 쿼리스트링: " + fullPath);
            const data = await get(fullPath);
            console.log(`GET: getHistoryByDate 완료, 반환된 값: ${JSON.stringify(data)}`);

            return data;
        },
        getHistoryByDateAndKeyword: function () {
            if (getNetworkState() === false) throw new Error(`현재 오프라인 모드입니다. networkState: false`);

        },
        getKeywordFrequency: async function () {
            if (getNetworkState() === false) throw new Error(`현재 오프라인 모드입니다. networkState: false`);

        },
        getTotalSpentTime: function () {
            if (getNetworkState() === false) throw new Error(`현재 오프라인 모드입니다. networkState: false`);

        }
    },
    del: {
        deleteHistory: function () {
            if (getNetworkState() === false) throw new Error(`현재 오프라인 모드입니다.`);

        }
    }
}

//url의 host와 path를 입력하면 둘을 이어주는 함수
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

function getNetworkState() {
    return networkState;
}

function setNetworkState(state) {
    if (state === true || state === false) {
        networkState = state;
    }
    else {
        console.log("serverstate.js: setServerstate의 밸류로 이상한 값 들어옴");
    }
}


export default networkManager;