import renderArticles from "../renderArticles/renderArticles.js";

const searchButton = document.getElementById('search-button');
const searchInput = document.getElementById('search-input');

const resultContainer = document.getElementById('result-container');

//버튼 클릭 시 데이터 가져옴
searchButton.addEventListener('click', () => {
    const searchValue = searchInput.value;
    chrome.runtime.sendMessage({ action: "GET_SEARCH_DATA_LIST", data: searchValue }, (response) => {
        const data = response.data;
        if (data === null) {
            console.error(`GET_SEARCH_DATA_LIST: 데이터 요청 실패: ${reponse.message}`);
            return;
        }
        const renderResult = renderArticles(data, resultContainer);

        resultContainer.innerHTML = "";
        resultContainer.appendChild(renderResult);
    });
});
