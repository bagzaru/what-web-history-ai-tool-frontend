import renderArticles from "./renderArticles/renderArticles.js";

const searchButton = document.getElementById('search-button');
const searchInput = document.getElementById('search-input');

const searchResultContainer = document.getElementById('result-container');

searchButton.addEventListener('click', () => {
    const searchValue = searchInput.value;
    chrome.runtime.sendMessage({ action: "GET_SEARCH_DATA_LIST", data: searchValue }, (response) => {
        const data = response.data;
        const renderResult = renderArticles(data, searchResultContainer);

        searchResultContainer.appendChild(renderResult);
    });
});
