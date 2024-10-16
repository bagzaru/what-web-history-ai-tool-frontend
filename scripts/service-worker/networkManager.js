import { post, put, get } from "./networking/RestAPI.js";
import { createHistoryDTO } from "./networking/historyDTO.js";
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

            //새 페이지가 로드되었을 때, 해당 url과 방문시각을 서버에 전송하여 저장합니다.
            const path = "/api/history";
            const fullPath = getFullPath(defaultHost, path);
            const body = createHistoryDTO(title, content, url, 0, getJavaDateString(new Date()));

            const data = await post(fullPath, body);
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
            const body = new FormData();
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
            const body = new FormData();
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
            //TODO: history 탐색기간 외부에서 입력받기

            const curTime = new Date();
            const startTime = new Date();
            startTime.setDate(curTime.getDate() - 7);

            //현재 queryString으로 전송, 추후 변경 가능성 있어 기존 코드 남겨둠
            //const path = '/api/history';
            // const body = {
            //     startTime: getJavaDateString(startTime),
            //     endTime: getJavaDateString(curTime)
            // };
            // const body = new FormData();
            // body.append('startTime', getJavaDateString(startTime));
            // body.append('endTime', getJavaDateString(curTime));
            const path = '/api/history' + '?' + 'startTime=' + getJavaDateString(startTime) + '&' + 'endTime=' + getJavaDateString(curTime) + '&orderBy=' + orderBy;
            const body = {};
            const fullPath = getFullPath(defaultHost, path);

            console.log("getHistoryByDate 요청, 쿼리스트링: " + fullPath);
            const data = await get(fullPath, body);
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