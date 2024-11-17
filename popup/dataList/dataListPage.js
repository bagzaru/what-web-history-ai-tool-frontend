import renderArticles from "../renderArticles/renderArticles.js";

const articleContainer = document.getElementById('article-container');

function loadDataList() {
    chrome.runtime.sendMessage({ action: "GET_ALL_DATA_LIST" }, (response) => {
        const data = response.data;
        const articles = renderArticles(data);
        articleContainer.innerHTML = "";
        articleContainer.appendChild(articles);
    });
}

loadDataList();