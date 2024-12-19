import { post, put, get, del } from "./RestAPI.js";
import { createHistoryRequestDTO, searchHistoryRequestDTO } from "./historyDTO.js";
import getJavaDateString from "../date/javaDateConverter.js";

//defaultHost: 기본 연결 서버 주소
export const defaultHost = "https://capstonepractice.site";

//networkState: true일 때만 서버와의 통신 진행
let networkState = true;

//서버와의 통신 모듈
const networkManager = {
    getNetworkState: getNetworkState,
    setNetworkState: setNetworkState,
    post: {
        saveHistory: async function ({ title, url, content }) {
            if (getNetworkState() === false) throw new Error(`현재 오프라인 모드입니다. networkState: false`);
            //url과 content를 입력받아, 해당 url의 방문기록을 저장합니다.
            const path = "/api/history";
            const fullPath = getFullPath(defaultHost, path);
            const jsonBody = createHistoryRequestDTO(url, content);
            const stringBody = JSON.stringify(jsonBody);    //saveHistory는 json dto 형태로 주고받는다.

            console.log("POST: saveHistory 요청, url: " + url);
            const data = await post(fullPath, stringBody);
            console.log(`POST: saveHistory 완료: ${url}, 반환된 값: ${JSON.stringify(data)}`);
            return data;
        },
        search: async function (startTime, endTime, query = "", domain = "", category = "") {
            if (getNetworkState() === false) throw new Error(`현재 오프라인 모드입니다. networkState: false`);

            //post.search: 해당 시간대와 domain에 대해 검색한 키워드를 가져옵니다.
            const path = `/api/history/search`;
            // const queryString = 'startTime=' + getJavaDateString(startTime) + '&' + 'endTime=' + getJavaDateString(endTime) + '&' + 'query=' + query;
            const fullPath = getFullPath(defaultHost, path);

            const javaStartTime = getJavaDateString(startTime);
            const javaEndTime = getJavaDateString(endTime);

            const jsonBody = searchHistoryRequestDTO(javaStartTime, javaEndTime, query, domain, category);
            const stringBody = JSON.stringify(jsonBody);    //search는 json dto 형태로 주고받는다.

            console.log("post.search 요청, 쿼리스트링: " + fullPath);
            const data = await post(fullPath, stringBody);
            console.log(`POST: search 완료, 반환된 값: ${JSON.stringify(data)}`);

            return data;
        },
        addCategory: async function (categoryName) {
            if (getNetworkState() === false) throw new Error(`현재 오프라인 모드입니다.`);
            // 카테고리를 추가합니다
            const path = '/api/category?';
            const queryString = `categoryName=${encodeURIComponent(categoryName)}`;
            const fullPath = getFullPath(defaultHost, path + queryString);

            console.log('POST: 카테고리 추가 쿼리스트링:', fullPath);
            const data = await post(fullPath);
            console.log(`POST: 카테고리 추가 완료, 반환된 값: ${data}`);
        }
    },
    put: {
        updateHistoryData: async function ({ url, startTime = 0, endTime = 0, category }) {
            if (getNetworkState() === false) throw new Error(`현재 오프라인 모드입니다. networkState: false`);

            //updateHistory: 해당 사이트의 체류 시간(visitTime) 및 배정된 카테고리를 업데이트합니다.

            //체류 시간 계산
            const spentTime = endTime - startTime;
            console.log(`PUT: url: ${url}, 머문 시간: ${spentTime}, 카테고리: ${category}`);

            // const body = {
            //     url: url,
            //     spentTime: spentTime,
            // };
            //PUT: updatehistory의 body는 formdata 형식으로 주고받는다.
            // const body = new FormData();
            // body.append("url", url);
            // body.append("spentTime", spentTime);

            // query string으로 방식 변경
            const path = '/api/history?';
            let queryString = `url=${encodeURIComponent(url)}&category=${encodeURIComponent(category)}`;
            if (spentTime) {
                queryString += `&spentTime=${spentTime}`;
            }

            const fullPath = getFullPath(defaultHost, path + queryString);
            console.log("PUT요청 쿼리스트링:", fullPath);
            const data = await put(fullPath);
            console.log(`PUT: updateHistoryData 완료, 반환된 값: ${JSON.stringify(data)}`);
            return data;
        },
        updateCategory: async function ({ originalName, newName }) {
            if (getNetworkState() === false) throw new Error(`현재 오프라인 모드입니다.`);
            const body = { originalName: originalName, newName:newName };
            const path = '/api/category';

            const fullPath = getFullPath(defaultHost, path);
            const stringBody = JSON.stringify(body);
            console.log("PUT요청: 카테고리 수정");
            const data = await put(fullPath, stringBody);
            console.log(`PUT: updateCategory 완료, 반환된 값: ${data}`);
            return data;
        }
    },
    get: {
        getHistories: async function (orderBy, startDate, endDate, page, size, sortOrder, domain, category) {
            if (getNetworkState() === false) throw new Error(`현재 오프라인 모드입니다. networkState: false`);

            //getHistoryByDate: 서버에서 지정된 기간에 저장한 페이지 데이터를 가져옵니다.
            //TODO: 외부에서 기간을 지정받아, 해당 기간 내의 방문기록 데이터 가져오기

            const path = '/api/history' + '?';
            let queryString = 'startTime=' + getJavaDateString(startDate) +
                '&endTime=' + getJavaDateString(endDate) +
                '&page=' + page +
                '&size=' + size +
                '&sort=' + orderBy + ',' + sortOrder;
            if (domain) {
                queryString += '&domain=' + domain;
            }
            if (category) {
                queryString += '&category=' + category;
            }
            const fullPath = getFullPath(defaultHost, path + queryString);

            console.log("getHistories 요청, 쿼리스트링: " + fullPath);
            const data = await get(fullPath);
            console.log(`GET: getHistories 완료, 반환된 값: ${JSON.stringify(data)}`);

            return data;
        },
        getHistoryById: async function (id) {
            if (getNetworkState() === false) throw new Error(`현재 오프라인 모드입니다. networkState: false`);

            //getHistoryById: history의 ID를 입력하여 해당 history를 가져옵니다.
            if (typeof id !== "number") {
                throw new Error("getHistoryById: id가 number 형식이 아님");
            }

            const path = '/api/history' + '/' + id;
            const fullPath = getFullPath(defaultHost, path);

            console.log("getHistoryById 요청, 쿼리스트링: " + fullPath);
            const data = await get(fullPath);
            console.log(`GET: getHistoryById 완료, 반환된 값: ${JSON.stringify(data)}`);

            return data;
        },
        getCategories: async function () {
            if (getNetworkState() === false) throw new Error(`현재 오프라인 모드입니다. networkState: false`);
            const path = '/api/category';
            const fullPath = getFullPath(defaultHost, path);
            console.log("getCategories 요청");
            const data = await get(fullPath);
            console.log(`GET: getCategories 완료, 반환된 값: ${JSON.stringify(data)}`);

            return data;
        },
        getKeywordSpentTime: async function (keyword, startTime, endTime) {
            if (getNetworkState() === false) throw new Error(`현재 오프라인 모드입니다. networkState: false`);

            //getKeywordSpentTime: 해당 키워드와 관련된 방문기록의 총 체류시간을 가져옵니다.
            const path = `/api/history/statistics/${keyword}/spent_time/`;
            const queryString = 'startTime=' + getJavaDateString(startTime) + '&' + 'endTime=' + getJavaDateString(endTime);
            const fullPath = getFullPath(defaultHost, path + queryString);

            console.log("getKeywordSpentTime 요청, 쿼리스트링: " + fullPath);
            const data = await get(fullPath);
            console.log(`GET: getKeywordSpentTime 완료, 반환된 값: ${JSON.stringify(data)}`);

            return data;
        },
        getKeywordFrequency: async function (keyword, startTime, endTime) {
            if (getNetworkState() === false) throw new Error(`현재 오프라인 모드입니다. networkState: false`);

            //getKeywordFrequency: 전체 데이터 중 해당 데이터의 빈도수를 가져옵니다.
            const path = `/api/history/statistics/${keyword}/frequency/`;
            const queryString = 'startTime=' + getJavaDateString(startTime) + '&' + 'endTime=' + getJavaDateString(endTime);
            const fullPath = getFullPath(defaultHost, path + queryString);

            console.log("getKeywordFrequency 요청, 쿼리스트링: " + fullPath);
            const data = await get(fullPath);
            console.log(`GET: getKeywordFrequency 완료, 반환된 값: ${JSON.stringify(data)}`);

            return data;
        },
        getBestDomain: async function (k, startTime, endTime) {
            if (getNetworkState() === false) throw new Error(`현재 오프라인 모드입니다. networkState: false`);

            //getBestDomain: 전체 데이터 중 방문 빈도수가 높은 도메인을 가져옵니다.
            const path = `/api/history/statistics/domain?`;
            const queryString = 'startTime=' + getJavaDateString(startTime) + '&' + 'endTime=' + getJavaDateString(endTime) + '&' + 'k=' + k;
            const fullPath = getFullPath(defaultHost, path + queryString);

            console.log("getBestDomain 요청, 쿼리스트링: " + fullPath);
            const data = await get(fullPath);
            console.log(`GET: getBestDomain 완료, 반환된 값: ${JSON.stringify(data)}`);

            return data;
        },
        getBestCategory: async function (k, startTime, endTime) {
            if (getNetworkState() === false) throw new Error(`현재 오프라인 모드입니다. networkState: false`);

            //getBestCategory: 전체 데이터 중 방문 빈도수가 높은 카테고리를 가져옵니다.
            const path = `/api/history/statistics/category?`;
            const queryString = 'k=' + k + '&' + 'startTime=' + getJavaDateString(startTime) + '&' + 'endTime=' + getJavaDateString(endTime);
            const fullPath = getFullPath(defaultHost, path + queryString);

            console.log("getBestCategory 요청, 쿼리스트링: " + fullPath);
            const data = await get(fullPath);
            console.log(`GET: getBestCategory 완료, 반환된 값: ${JSON.stringify(data)}`);

            return data;
        }
    },
    del: {
        deleteHistory: async function (url) {
            if (getNetworkState() === false) throw new Error(`현재 오프라인 모드입니다.`);

            //deleteHistory: 특정 데이터를 삭제합니다
            const path = `/api/history?`;
            const queryString = `url=${encodeURIComponent(url)}`;
            const fullPath = getFullPath(defaultHost, path + queryString);

            console.log("deleteHistory 요청, 쿼리스트링: " + fullPath);
            const data = await del(fullPath);
            console.log(`DELETE: deleteHistory 완료, 반환된 값: ${data}`);

            return data;
        },
        deleteCategory: async function (categoryName) {
            if (getNetworkState() === false) throw new Error(`현재 오프라인 모드입니다.`);
            // deleteCategory: 특정 카테고리를 삭제합니다
            const path = '/api/category?';
            const queryString = `categoryName=${encodeURIComponent(categoryName)}`;
            const fullPath = getFullPath(defaultHost, path + queryString);

            console.log('deleteCategory 요청, 쿼리스트링:', fullPath);
            const data = await del(fullPath);
            console.log(`DELETE: deleteCategory 완료, 반환된 값: ${data}`);
            return data;
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