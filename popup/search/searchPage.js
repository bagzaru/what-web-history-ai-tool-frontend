import renderArticles from "../renderArticles/renderArticles.js";

const searchButton = document.getElementById('search-button');
const searchInput = document.getElementById('search-input');

const contentBox = document.getElementById('content-box');

let optionData = {};

document.addEventListener("DOMContentLoaded", async () => {
    //검색 기능 초기화
    //버튼 클릭 시 데이터 가져옴
    searchButton.addEventListener('click', loadSearchData);
    searchInput.addEventListener('keydown', (e) => {
        if (e.key === "Enter") {
            loadSearchData();
        }
    });

    //옵션 초기화
    const periodSet = await getPeriodOptions();
    initDropdown(periodSet, "period-menu", "기간");

    const domainSet = await getDomainOptions();
    initDropdown(domainSet, "domain-menu", "도메인");

    const categorySet = await getCategoryOptions();
    initDropdown(categorySet, "category-menu", "카테고리");
});


function loadSearchData() {
    //로고 사라지게
    const logo = document.querySelector(".logo-container");
    logo.style.opacity = 0;

    //로딩 스피너 보이게
    const loadingContainer = document.querySelector('.loading-container');
    loadingContainer.style.opacity = 1;

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
        //로딩 스피너 안보이게
        loadingContainer.style.opacity = 0;
        if (data === null) {
            console.error(`GET_SEARCH_DATA_LIST: 데이터 요청 실패: ${response.message}`);
            const loadingFailureText = document.querySelector('#loading-failure-text');
            loadingFailureText.classList.remove('hidden');
            return;
        }

        console.log("검색창 검색 결과 로드 완료");

        const contentBox = document.getElementById("content-box");
        const articleContainer = document.createElement("div");
        articleContainer.id = "article-container";

        const renderResult = renderArticles(data, [searchOption.category]);

        articleContainer.appendChild(renderResult);
        contentBox.appendChild(articleContainer);
    });
}

function dettachDropdown() {
    const dropdownMenu = document.getElementById("option-container");
    dropdownMenu.innerHTML = "";
}

function attachOption(label, option) {
    optionData[option.type] = option;
    label.textContent = option.text;

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
            onclick: (label) => {
                //TODO: 직접 선택 구현
                const calendarDiv = document.getElementById("calendar-selection-popup");
                calendarDiv.style.display = "block";

                const confirmButton = document.getElementById("calendar-selection-confirm-button");
                confirmButton.addEventListener("click", () => {
                    calendarDiv.style.display = "none";

                    const calendarStart = document.getElementById("calendar-start-date-input");
                    const calendarEnd = document.getElementById("calendar-end-date-input");

                    attachOption(label, {
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
    const sendData = { type: "category", k: categoryLength, startDate: "", endDate: "" };

    const waitToMessage = () => {
        return new Promise((resolve, reject) => {
            chrome.runtime.sendMessage({ senderName: "popup", action: "GET_STATISTICS", data: sendData }, (response) => {
                if (chrome.runtime.lastError) {
                    reject(chrome.runtime.lastError);
                } else {
                    resolve(response);
                }
            });
        });
    }

    // 사용 예시
    const response = await waitToMessage();

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

    return result;
}

async function getDomainOptions() {
    const domainLength = 5;
    const result = [];
    result.push({ type: "domain", text: "직접 입력", tag: "input" });

    const sendData = { type: "domain", k: domainLength, startDate: "", endDate: "" };

    const waitToMessage = () => {
        return new Promise((resolve, reject) => {
            chrome.runtime.sendMessage({ senderName: "popup", action: "GET_STATISTICS", data: sendData }, (response) => {
                if (chrome.runtime.lastError) {
                    reject(chrome.runtime.lastError);
                } else {
                    resolve(response);
                }
            });
        });
    }


    // 사용 예시
    const response = await waitToMessage();
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

    return result;
}

function closeAllDropdowns(exceptDropdown) {
    // 다른 드롭다운 닫기
    const dropdowns = document.querySelectorAll('.dropdown');
    dropdowns.forEach((dropdown) => {
        dropdown.classList.remove('open');
    });
    const dropdownMenus = document.querySelectorAll('.dropdown-menu');
    dropdownMenus.forEach((menu) => {
        menu.style.display = 'none';
    });
}

function initDropdown(items, menuName, menuText) {
    const dropdown = document.getElementById(menuName);
    console.log("initDropdown" + dropdown);

    const label = document.createElement('span');
    label.textContent = menuText;
    label.classList.add("dropdown-label");
    dropdown.appendChild(label);

    const arrow = document.createElement('span');
    arrow.classList.add("dropdown-arrow");
    dropdown.appendChild(arrow);

    const dropdownMenu = document.createElement('div');
    dropdownMenu.id = "dropdown-menu";
    dropdownMenu.classList.add('dropdown-menu');
    dropdown.appendChild(dropdownMenu);

    const ul = document.createElement('ul');
    dropdownMenu.appendChild(ul);

    //드랍다운 클릭 시 이벤트
    dropdown.addEventListener('click', (event) => {
        event.stopPropagation(); // 드롭다운 내부 클릭 이벤트가 상위로 전달되지 않도록 방지
        // 다른 드롭다운 닫기
        closeAllDropdowns(dropdown);
        // 현재 드롭다운 토글
        if (dropdown.classList.contains('open')) {
            dropdownMenu.style.display = 'none';
            dropdown.classList.remove('open');
        } else {
            dropdownMenu.style.display = 'block';
            dropdown.classList.add('open');
        }
    });

    //각 아이템에 대해 요소 추가
    items.forEach((item) => {
        const li = document.createElement('li');
        li.textContent = item.text;
        console.log("item:" + item.text);

        li.addEventListener('click', (event) => {
            event.stopPropagation();
            //TODO: onClick 존재 시 분기 처리
            if (item.onclick !== undefined) {
                item.onclick(label);
                return;
            }
            else {
                //attach to top side
                attachOption(label, item);
            }
            label.textContent = item.text;

            dropdownMenu.style.display = "none";
            dropdown.classList.remove("open");
        });
        ul.appendChild(li);
    });


    // 외부 클릭 감지 및 드롭다운 닫기
    document.addEventListener('click', () => {
        dropdown.classList.remove('open');
        dropdownMenu.style.display = 'none';
    });

    dropdown.classList.remove('open');
    dropdownMenu.style.display = 'none';
}
