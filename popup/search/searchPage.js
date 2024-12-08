//import renderArticles from "../renderArticles/renderArticles.js";

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
    chrome.runtime.sendMessage({ senderName: "popup", action: "GET_SEARCH_DATA_LIST", data: searchOption }, (response) => {
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
document.addEventListener("DOMContentLoaded", () => {
    const periodButton = document.getElementById("period-set-button");
    const dropdownMenu = document.getElementById("dropdown-menu");
    const periodSet = [
        { text: "오늘", onClick: () => { } },
        { text: "3일", onClick: () => { } },
        { text: "일주일", onClick: () => { } },
        { text: "한달", onClick: () => { } },
        { text: "3개월", onClick: () => { } },
        { text: "1년", onClick: () => { } },
        { text: "직접선택", onClick: () => { } }
    ];

    const domainButton = document.getElementById("domain-set-button");
    const domainSet = [
        { text: "everytime.kr", onclick: () => { } },
        { text: "inven.co.kr", onclick: () => { } },
        { text: "naver.com", onclick: () => { } },
        { text: "tistory.com", onclick: () => { } },
        { text: "namu.wiki", onclick: () => { } },
    ]
    const categoryButton = document.getElementById("category-set-button");
    const categorySet = [
        { text: "뉴스", onclick: () => { } },
        { text: "메인", onclick: () => { } },
        { text: "스포츠", onclick: () => { } },
        { text: "컴퓨터 공학", onclick: () => { } },
        { text: "게임", onclick: () => { } },
    ]

    periodButton.addEventListener("click", () => {
        if (dropdownMenu.style.display === "none" || !dropdownMenu.style.display) {
            attachDropdown(periodSet);
        } else {
            dettachDropdown();
        }
    });

    domainButton.addEventListener("click", () => {
        if (dropdownMenu.style.display === "none" || !dropdownMenu.style.display) {
            attachDropdown(domainSet);
        }
        else {
            dettachDropdown();
        }
    });


    categoryButton.addEventListener("click", () => {
        if (dropdownMenu.style.display === "none" || !dropdownMenu.style.display) {
            attachDropdown(categorySet);
        }
        else {
            dettachDropdown();
        }
    });

    document.addEventListener("click", (event) => {
        if (!dropdownMenu.contains(event.target) && event.target !== periodButton && event.target !== domainButton && event.target !== categoryButton) {
            dettachDropdown();
        }
    });
});


function attachDropdown(items) {
    const dropdownMenu = document.getElementById("dropdown-menu");
    dropdownMenu.style.display = "flex";

    items.forEach((item) => {
        const button = document.createElement('button');
        button.textContent = item.text;
        button.addEventListener('click', () => {
            //attach to top side
            attachOption(item.text);
            dettachDropdown();
        });
        dropdownMenu.appendChild(button);
    });
}

function dettachDropdown() {
    const dropdownMenu = document.getElementById("dropdown-menu");
    dropdownMenu.style.display = "none";
    dropdownMenu.innerHTML = "";
}


function attachOption(optionName) {
    const optionBox = document.getElementById("search-option-box");
    const option = document.createElement('button');
    option.textContent = optionName;
    option.addEventListener('click', () => {
        optionBox.removeChild(option);
    });

    optionBox.appendChild(option);


}