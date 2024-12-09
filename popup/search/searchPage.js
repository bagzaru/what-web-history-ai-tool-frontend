//import renderArticles from "../renderArticles/renderArticles.js";

const searchButton = document.getElementById('search-button');
const searchInput = document.getElementById('search-input');

const resultContainer = document.getElementById('result-container');

let optionData = {};

//버튼 클릭 시 데이터 가져옴
searchButton.addEventListener('click', () => {
    const searchOption = {
        query: searchInput.value,
        startDate: "",
        endDate: "",
        domain: "",
        category: ""
    }

    //기간 설정
    if (optionData.period !== undefined) {
        if (optionData.period.date !== undefined) {
            searchOption.startDate = optionData.period.date;
            searchOption.endDate = new Date();
        }
        if (optionData.period.startDate !== undefined) {
            searchOption.startDate = optionData.period.startDate;
        }
        if (optionData.period.endDate !== undefined) {
            searchOption.endDate = optionData.period.endDate;
        }
    }

    //도메인 설정
    if (optionData.domain !== undefined) {
        searchOption.domain = optionData.domain.text;
    }

    //카테고리 설정
    if (optionData.category !== undefined) {
        searchOption.category = optionData.category.text;
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

document.addEventListener("DOMContentLoaded", async () => {
    const periodButton = document.getElementById("period-set-button");
    const dropdownMenu = document.getElementById("dropdown-menu");

    const periodSet = await getPeriodOptions();

    periodButton.addEventListener("click", () => {
        attachDropdown(periodSet);
    });

    const domainSet = await getDomainOptions();
    const domainButton = document.getElementById("domain-set-button");

    const categorySet = await getCategoryOptions();
    const categoryButton = document.getElementById("category-set-button");

    domainButton.addEventListener("click", () => {
        attachDropdown(domainSet);
    });


    categoryButton.addEventListener("click", () => {
        attachDropdown(categorySet);
    });

    //드랍다운 이외 다른 곳 눌리면 드랍다운 닫힘
    // document.addEventListener("click", (event) => {
    //     if (!dropdownMenu.contains(event.target) && event.target !== periodButton && event.target !== domainButton && event.target !== categoryButton) {
    //         dettachDropdown();
    //     }
    // });
});

//드랍다운 생성
function attachDropdown(items) {
    dettachDropdown();
    const dropdownMenu = document.getElementById("option-container");

    items.forEach((item) => {
        const selector = document.createElement('div');
        let clickable = selector;
        if (item.tag === "input") {
            selector.classList.add("input");
            selector.type = "text";
            selector.placeholder = item.text;

            const input = document.createElement('input');
            input.placeholder = item.text;
            selector.appendChild(input);

            const inputButton = document.createElement('button');
            inputButton.textContent = "✅";
            inputButton.addEventListener('click', () => {
                attachOption({ type: item.type, text: input.value });
                dettachDropdown();
            });
            selector.appendChild(inputButton);
        }
        else {
            selector.textContent = item.text;
            selector.classList.add("selector");
            selector.addEventListener('click', () => {
                //TODO: onClick 존재 시 분기 처리
                if (item.onclick !== undefined) {
                    item.onclick();
                    return;
                }
                //attach to top side
                attachOption(item);
                dettachDropdown();
            });
        }

        dropdownMenu.appendChild(selector);
    });
}

function dettachDropdown() {
    const dropdownMenu = document.getElementById("option-container");
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

async function getPeriodOptions() {
    const currentDate = new Date();
    return [
        { type: "period", text: "24시간 이내", date: getSubtractDate(currentDate, 0, 0, 1) },
        { type: "period", text: "일주일 이내", date: getSubtractDate(currentDate, 0, 0, 7) },
        { type: "period", text: "한달 이내", date: getSubtractDate(currentDate, 0, 1) },
        { type: "period", text: "3개월 이내", date: getSubtractDate(currentDate, 0, 3) },
        { type: "period", text: "1년 이내", date: getSubtractDate(currentDate, 1) },
        {
            type: "period", text: "직접 선택",
            onclick: () => {
                //TODO: 직접 선택 구현
                const calendarDiv = document.getElementById("calendar-selection-popup");
                calendarDiv.style.display = "block";

                const confirmButton = document.getElementById("calendar-selection-confirm-button");
                confirmButton.addEventListener("click", () => {
                    calendarDiv.style.display = "none";

                    const calendarStart = document.getElementById("calendar-start-date-input");
                    const calendarEnd = document.getElementById("calendar-end-date-input");

                    attachOption({
                        type: "period", text: `기간: ${calendarStart.value} ~ ${calendarEnd.value}`,
                        startDate: new Date(calendarStart.value),
                        endDate: new Date(calendarEnd.value)
                    });

                });
                dettachDropdown();
                //calendar input 가져와 선택한 날짜로 설정
                //이후 
            }
        },
    ];
}

async function getCategoryOptions() {
    const categoryLength = 5;
    const result = [];
    result.push({ type: "category", text: "직접 입력", tag: "input" });

    const sendData = { type: "category", k: categoryLength, startDate: "", endDate: "" };

    chrome.runtime.sendMessage({ senderName: "popup", action: "GET_STATISTICS", data: sendData }, (response) => {
        const data = response.data;
        if (data === null) {
            console.error(`GET_STATISTICS:category: 데이터 요청 실패: ${response.message}`);
            return;
        }
        for (let i = categoryLength - 1; i >= 0; i--) {
            const domain = { type: "category", text: `${data[i]}` };
            result.unshift(domain);
        }
        console.log("categorySet:" + JSON.stringify(result));
    });
    return result;

}

async function getDomainOptions() {
    const domainLength = 5;
    const result = [];
    result.push({ type: "domain", text: "직접 입력", tag: "input" });

    const sendData = { type: "domain", k: domainLength, startDate: "", endDate: "" };

    chrome.runtime.sendMessage({ senderName: "popup", action: "GET_STATISTICS", data: sendData }, (response) => {
        const data = response.data;
        if (data === null) {
            console.error(`GET_STATISTICS:domain: 데이터 요청 실패: ${response.message}`);
            return;
        }
        for (let i = domainLength - 1; i >= 0; i--) {
            const domain = { type: "domain", text: `${data[i]}` };
            result.unshift(domain);
        }
        console.log("domainSet:" + JSON.stringify(result));
    });
    return result;
}