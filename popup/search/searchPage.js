import renderArticles from "../renderArticles/renderArticles.js";

const searchButton = document.getElementById('search-button');
const searchInput = document.getElementById('search-input');
const startDateInput = document.getElementById('startDate-input');
const endDateInput = document.getElementById('endDate-input');
const domainInput = document.getElementById('domain-input');

const resultContainer = document.getElementById('result-container');

//버튼 클릭 시 데이터 가져옴
searchButton.addEventListener('click', () => {
    const searchOption = {
        query: searchInput.value,
        startDate: startDateInput.value,
        endDate: endDateInput.value,
        domain: domainInput.value
    }
    chrome.runtime.sendMessage({ action: "GET_SEARCH_DATA_LIST", data: searchOption }, (response) => {
        const data = response.data;
        if (data === null) {
            console.error(`GET_SEARCH_DATA_LIST: 데이터 요청 실패: ${response.message}`);
            return;
        }
        const renderResult = renderArticles(data, resultContainer);

        resultContainer.innerHTML = "";
        resultContainer.appendChild(renderResult);
    });
});
