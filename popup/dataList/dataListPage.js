import renderArticles from "../renderArticles/renderArticles.js";

const articleContainer = document.getElementById('article-container');

function loadDataList() {
    console.log("데이터 로드 시도");
    chrome.runtime.sendMessage({ senderName: "popup", action: "GET_ALL_DATA_LIST" }, (response) => {
        const data = response.data;
        if (data === null) {
            console.log("데이터 요청 실패: " + response.message);
        }
        else {
            console.log("데이터 요청 성공");
        }
        console.log("데이터: " + JSON.stringify(data));
        const articles = renderArticles(data);
        articleContainer.innerHTML = "";
        articleContainer.appendChild(articles);
    });
}

loadDataList();