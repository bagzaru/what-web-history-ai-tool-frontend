import { post, put } from "./networking/dataSender.js";

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

//서버와의 통신 모듈
const server = {
    defaultHost: 'https://capstonepractice.site',
    post: {
        saveHistory: function () {

        }
    },
    put: {
        updateHistory: async function ({ tabId, url, startTime, endTime }) {
            //서버로 전송하여 해당 url의 체류 시간을 업데이트한다.
            const spentTime = endTime - startTime;

            //해당 url의 id를 확인한다. 체크한다.

            console.log(`PUT: url: ${url}, 머문 시간: ${spentTime} `)

            const path = '/api/history/2';
            const body = {
                id: url,
                spentTime: spentTime,
            };
            const fullPath = getFullPath(defaultHost, path);

            put(fullPath, body);
        },

        extractKeywords: function () {

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