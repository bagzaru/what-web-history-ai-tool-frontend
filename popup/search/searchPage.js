//import renderArticles from "../renderArticles/renderArticles.js";

const searchButton = document.getElementById('search-button');
const searchInput = document.getElementById('search-input');
const startDateInput = document.getElementById('startDate-input');
const endDateInput = document.getElementById('endDate-input');
const domainInput = document.getElementById('domain-input');

const resultContainer = document.getElementById('result-container');

let optionData = {};

//버튼 클릭 시 데이터 가져옴
searchButton.addEventListener('click', () => {
    const searchOption = {
        query: searchInput.value,
        startDate: "",
        endDate: "",
        domain: ""
    }
    if (optionData.period !== undefined) {
        searchOption.startDate = optionData.period.date;
        searchOption.endDate = new Date();
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
    const currentDate = new Date();
    const periodButton = document.getElementById("period-set-button");
    const dropdownMenu = document.getElementById("dropdown-menu");
    const periodSet = [
        { type: "period", text: "24시간 이내", date: getSubtractDate(currentDate, 0, 0, 1) },
        { type: "period", text: "일주일 이내", date: getSubtractDate(currentDate, 0, 0, 7) },
        { type: "period", text: "한달 이내", date: getSubtractDate(currentDate, 0, 1) },
        { type: "period", text: "3개월 이내", date: getSubtractDate(currentDate, 0, 3) },
        { type: "period", text: "1년 이내", date: getSubtractDate(currentDate, 1) },
        {
            type: "period", text: "직접 선택",
            onclick: () => {
                //TODO: 직접 선택 구현
            }
        },
    ];

    periodButton.addEventListener("click", () => {
        if (dropdownMenu.style.display === "none" || !dropdownMenu.style.display) {
            attachDropdown(periodSet);
        } else {
            dettachDropdown();
        }
    });

    const domainButton = document.getElementById("domain-set-button");
    const domainSet = [
        { type: "domain", text: "everytime.kr", onclick: () => { } },
        { type: "domain", text: "inven.co.kr", onclick: () => { } },
        { type: "domain", text: "naver.com", onclick: () => { } },
        { type: "domain", text: "tistory.com", onclick: () => { } },
        { type: "domain", text: "namu.wiki", onclick: () => { } },
    ]
    const categoryButton = document.getElementById("category-set-button");
    const categorySet = [
        { type: "category", text: "뉴스", onclick: () => { } },
        { type: "category", text: "메인", onclick: () => { } },
        { type: "category", text: "스포츠", onclick: () => { } },
        { type: "category", text: "컴퓨터 공학", onclick: () => { } },
        { type: "category", text: "게임", onclick: () => { } },
    ]

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
            attachOption(item);
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

function attachOption(option) {
    optionData[option.type] = option;
    renderOptionData();
}

function renderOptionData() {
    const optionBox = document.getElementById("search-option-box");
    optionBox.innerHTML = "";
    for (let key in optionData) {
        const value = optionData[key]; //데이터 꺼내옴
        console.log(JSON.stringify(value));

        const optionButton = document.createElement('button');  //버튼 생성
        optionButton.textContent = value.text;   //버튼 텍스트 설정
        optionButton.addEventListener('click', () => {
            optionData[key] = undefined;    //해당 데이터 삭제
            renderOptionData();             //optionDataRender 재호출
        });
        optionBox.appendChild(optionButton);
    }
}


function getSubtractDate(date, year = 0, month = 0, day = 0, hour = 0, minute = 0, second = 0) {
    return new Date(date.getFullYear() - year, date.getMonth() - month, date.getDate() - day, date.getHours() - hour, date.getMinutes() - minute, date.getSeconds() - second);
}