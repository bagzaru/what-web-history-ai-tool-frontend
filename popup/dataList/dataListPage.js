import renderArticles from "../renderArticles/renderArticles.js";

let currentQueries = {
    startTime: '',
    endTime: '',
    domain: '',
    category: '',
    page: '',
    size: '',
    sortBy: '',
    sortOrder: '',
}

document.addEventListener("DOMContentLoaded", async () => {
    await renderMenu();
    await updateDomainList({});
    loadDataList(currentQueries);
    addMovePageButton();

    const dropdowns = document.querySelectorAll('.dropdown');
    dropdowns.forEach((dropdown) => {
        const label = dropdown.querySelector('.dropdown-label');
        const arrow = dropdown.querySelector('.dropdown-arrow');
        const menuId = dropdown.getAttribute('data-menu');
        const menu = document.getElementById(menuId);

        dropdown.addEventListener('click', async(event) => {
            event.stopPropagation(); // 드롭다운 내부 클릭 이벤트가 상위로 전달되지 않도록 방지
            // 다른 드롭다운 닫기
            dropdowns.forEach((otherDropdown) => {
                if (otherDropdown !== dropdown) {
                    const otherMenu = document.getElementById(
                        otherDropdown.getAttribute('data-menu')
                    );
                    otherDropdown.classList.remove('open');
                    if (otherMenu) otherMenu.style.display = 'none';
                }
            });
            // 도메인 설정 드롭다운 일 때
            if (dropdown.getAttribute('data-menu') === 'domain-menu'){
                await updateDomainList({startDate: currentQueries.startTime, endDate: currentQueries.endTime});
            }
            // 현재 드롭다운 토글
            if (dropdown.classList.contains('open')) {
                menu.style.display = 'none';
                dropdown.classList.remove('open');
            } else {
                menu.style.display = 'block';
                dropdown.classList.add('open');
            }
        });
        // `li` 태그 클릭 이벤트 처리
        menu.querySelectorAll('li').forEach((option) => {
            option.addEventListener('click', async(event) => {
                event.stopPropagation();
                const selectedOption = option.textContent;
                const selectedValue = option.getAttribute('data-value');
                label.textContent = selectedOption; // 선택된 값으로 레이블 변경
                // 드롭다운 닫기
                menu.style.display = 'none';
                menu.setAttribute('data-value', `${selectedValue}`);
                dropdown.classList.remove('open'); // 클래스 제거
                // 기간 설정 메뉴일 때
                if (menu.id === 'period-menu'){
                    if (selectedValue === 'user-defined-period') {
                        const selectPeriodPopup = document.getElementById('select-period-overlay');
                        selectPeriodPopup.style.display = 'block';
                    } else {
                        const period = getPeriodOptions(selectedValue);
                        console.log('period:',period)
                        currentQueries.startTime = period.startDate;
                        currentQueries.endTime = period.endDate;
                    }
                }
                // 도메인 설정 메뉴이면서 user-defined-domain 일 떄
                if (menu.id === 'domain-menu' && selectedValue === 'user-defined-domain') {
                    const setDomainPopup = document.getElementById('set-domain-overlay');
                    setDomainPopup.style.display = 'block';
                }
            });
        });
    });
    // 외부 클릭 감지 및 드롭다운 닫기
    document.addEventListener('click', () => {
        dropdowns.forEach((dropdown) => {
            const menu = document.getElementById(dropdown.getAttribute('data-menu'));
            dropdown.classList.remove('open');
            if (menu) menu.style.display = 'none';
        });
    });
    //적용 버튼 리스너
    const applyButton = document.getElementById('apply-button');
    applyButton.addEventListener('click', () => {
        const domainMenu = document.getElementById('domain-menu');
        const sortMenu = document.getElementById('sort-menu');
        const orderMenu = document.getElementById('toggle-button');

        const domainValue = domainMenu.getAttribute('data-value');
        const sortValue = sortMenu.getAttribute('data-value');
        let orderValue = 'desc';
        if (orderMenu.checked) {
            orderValue = 'asc';
        } else {
            orderValue = 'desc';
        }
        currentQueries.sortBy = sortValue;
        currentQueries.sortOrder = orderValue;
        currentQueries.domain = domainValue;
        currentQueries.page = 0;
        console.log('currentQueries', currentQueries);
        loadDataList(currentQueries);
    })

    // 기간 설정 버튼 리스너
    const selectPeriodButton = document.getElementById('select-period-button');
    selectPeriodButton.addEventListener('click', async (event) => {
        event.stopPropagation();
        const parent = document.getElementById('select-period-overlay');
        const startTimeInput = document.getElementById('startDate');
        const endTimeInput = document.getElementById('endDate');
        if (!startTimeInput.value){
            alert('시작일을 선택하세요');
            startTimeInput.focus();
            return;
        }
        if (!endTimeInput.value){
            alert('종료일을 선택하세요');
            endTimeInput.focus();
            return;
        }
        if (startTimeInput.value > endTimeInput.value) {
            alert('시작일은 종료일보다 빨라야 합니다');
            startTimeInput.focus();
            return;
        }
        const periodLabel = document.getElementById('period-label');
        const period = getPeriodOptions('user-defined-period');
        periodLabel.textContent = `${startTimeInput.value.slice(2)}~${endTimeInput.value.slice(2)}`;
        currentQueries.startTime = period.startDate;
        currentQueries.endTime = period.endDate;
        parent.style.display = 'none'
    });
    //기간 설정 팝업 닫기 버튼
    const closePeriodPopup = document.getElementById('close-period-popup-button');
    closePeriodPopup.addEventListener('click', async(event) => {
        event.stopPropagation();
        const periodLabel = document.getElementById('period-label');
        const setPeriodPopup = document.getElementById('select-period-overlay');
        periodLabel.textContent = '기간';
        setPeriodPopup.style.display = 'none';
        currentQueries.startTime = "";
        currentQueries.endTime = "";
    });

    // 도메인 설정 버튼 리스너
    const setDomainButton = document.getElementById('set-domain-button');
    setDomainButton.addEventListener('click', (event) => {
        event.stopPropagation();
        const domainInput = document.getElementById('domain-input');
        const domainMenu = document.getElementById('domain-menu');
        const domainLabel = document.getElementById('domain-label');
        const setDomainPopup = document.getElementById('set-domain-overlay');
        if (!domainInput.value) {
            alert('값을 입력하세요');
            domainInput.focus();
            return;
        }
        domainMenu.setAttribute('data-value', `${domainInput.value}`);
        domainLabel.textContent = domainInput.value;
        setDomainPopup.style.display = 'none';
    })
    // 도메인 설정시 엔터키 리스너
    const setDomainInput = document.getElementById('domain-input');
    setDomainInput.addEventListener('keydown', (event) => {
        if (event.key === 'Enter') {
            event.preventDefault();
            const domainMenu = document.getElementById('domain-menu');
            const domainLabel = document.getElementById('domain-label');
            const setDomainPopup = document.getElementById('set-domain-overlay');
            if (!event.target.value) {
                alert('값을 입력하세요');
                event.target.focus();
                return;
            }
            domainMenu.setAttribute('data-value', `${event.target.value}`);
            domainLabel.textContent = event.target.value;
            setDomainPopup.style.display = 'none';
        }
    });
    //도메인 설정 팝업 닫기 버튼
    const closeDomainPopup = document.getElementById('close-domain-popup-button');
    closeDomainPopup.addEventListener('click', (event) => {
        event.stopPropagation();
        const setDomainPopup = document.getElementById('set-domain-overlay');
        setDomainPopup.style.display = 'none';
    });
});

function getSubtractDate(date, year = 0, month = 0, day = 0, hour = 0, minute = 0, second = 0) {
    return new Date(date.getFullYear() - year, date.getMonth() - month, date.getDate() - day, date.getHours() - hour, date.getMinutes() - minute, date.getSeconds() - second);
}

// 방문기록 데이터 렌더링
function loadDataList({startTime, endTime, domain, category, page, size, sortBy, sortOrder}) {
    const articleContainer = document.getElementById('article-container');
    const pageNumList = document.querySelector('.page-num-list');
    console.log("데이터 로드 시도");
    chrome.runtime.sendMessage({ 
            senderName: "popup", 
            action: "GET_ALL_DATA_LIST",
            queries: {
                startTime: startTime,
                endTime: endTime,
                domain: domain,
                category: category,
                page: page,
                size: size,
                sortBy: sortBy,
                sortOrder: sortOrder
            } 
        }, async (response) => {
        const data = response.data;
        if (data === null) {
            console.log("데이터 요청 실패: " + response.message);
        }
        else {
            console.log("데이터 요청 성공");
        }
        console.log("데이터: " + JSON.stringify(data));
        resetData();
        const categories = await getCategories();
        const articles = renderArticles(data.content, categories);
        articleContainer.appendChild(articles);
        if (pageNumList.children.length === 0) {
            renderPaging(data.totalPages);
        }
        const elementTop = articleContainer.offsetTop - 85;
        window.scrollTo({ top: elementTop, behavior:'auto'});
    });
}

function resetData(){
    const articleContainer = document.getElementById('article-container');
    articleContainer.innerHTML = "";
}

// 카테고리를 가져오는 함수
function getCategories() {
    return new Promise((resolve, reject) => {
        chrome.storage.sync.get("categories", (result) => {
            if (chrome.runtime.lastError) {
                reject(chrome.runtime.lastError);
            } else {
                resolve(result.categories); //return token
            }
        });
    });
}

// 상단 메뉴를 렌더링하는 함수
async function renderMenu() {
    // `chrome.storage.sync`에서 리스트 가져오기
    const list = await getCategories();
    list.unshift('전체');

    // 메뉴 리스트 요소 가져오기
    const menuList = document.querySelector('.menu-list');

    // 리스트 항목을 동적으로 추가
    list.forEach(item => {
        const listItem = document.createElement('li');
        listItem.textContent = item; // 항목 텍스트
        if (item === '전체'){
            listItem.classList.add('active');
        }
        changeStyleCategory.call(listItem);
        menuList.appendChild(listItem);
    });

    // 스크롤 버튼 활성화
    addScrollButtons();
}

// 스크롤 버튼 기능 추가
function addScrollButtons() {
    const scrollMenu = document.querySelector('.scroll-menu');
    const leftBtn = document.getElementById('left-btn');
    const rightBtn = document.getElementById('right-btn');

    const scrollDistance = 200; // 한 번에 스크롤할 거리 (픽셀)
    const scrollDuration = 500; // 애니메이션 지속 시간 (밀리초)

    leftBtn.addEventListener('click', () => {
        smoothScroll(scrollMenu, -scrollDistance, scrollDuration);
    });

    rightBtn.addEventListener('click', () => {
        smoothScroll(scrollMenu, scrollDistance, scrollDuration);
    });
}

// 스크롤 애니메이션 함수
function smoothScroll(container, distance, duration) {
    const startTime = performance.now();
    const initialScrollLeft = container.scrollLeft;

    function animateScroll(currentTime) {
        const elapsedTime = currentTime - startTime;
        const progress = Math.min(elapsedTime / duration, 1); // 0 ~ 1 사이 값

        // Ease-in-out 효과 적용 (커스텀 속도 제어 가능)
        const ease = progress < 0.5 
            ? 2 * progress * progress 
            : 1 - Math.pow(-2 * progress + 2, 2) / 2;

        // 현재 스크롤 위치 계산
        container.scrollLeft = initialScrollLeft + distance * ease;

        // 애니메이션 진행
        if (progress < 1) {
            requestAnimationFrame(animateScroll);
        }
    }

    requestAnimationFrame(animateScroll);
}

// 활성화 된 탭 표시
function changeStyleCategory() {
    this.addEventListener("click", function () {
        const list = this.parentNode.children;
        const firstChild = this.parentNode.firstElementChild;
        for (let item of list) {
            if (item.classList.contains("active")) {
                item.classList.remove("active");
            }
        }
        this.classList.add("active");
        if (this === firstChild){
            currentQueries.category = '';
            currentQueries.page = 0;
        } else {
            currentQueries.category = this.textContent;
            currentQueries.page = 0;
        }
        resetPaging();
        loadDataList(currentQueries);
        updateVisibleItems();
    });
}

// 하단 페이징 메뉴를 렌더링하는 함수
function renderPaging(totalPageNum) {
    // 메뉴 리스트 요소 가져오기
    const pageNumList = document.querySelector('.page-num-list');

    for (let i = 0; i < totalPageNum; i++){
        const listItem = document.createElement('li');
        listItem.textContent = `${i + 1}`;
        if (i === 0) {
            listItem.classList.add('active');
        }
        changeStylePage.call(listItem);
        pageNumList.appendChild(listItem);
    }
    updateVisibleItems();
}

// 활성화 된 페이지 번호 표시
function changeStylePage() {
    this.addEventListener("click", function () {
        const list = Array.from(this.parentNode.children);
        const clickedIndex = list.indexOf(this);
        for (let item of list) {
            if (item.classList.contains("active")) {
                item.classList.remove("active");
            }
        }
        this.classList.add("active");
        currentQueries.page = clickedIndex;
        loadDataList(currentQueries);
        updateVisibleItems();
    });
}

// 페이징 메뉴 초기화
function resetPaging() {
    const pageNumList = document.querySelector('.page-num-list');
    pageNumList.innerHTML = "";
}

// 페이지 이동 버튼 기능 활성화
function addMovePageButton() {
    const prevPageButton = document.getElementById('prev-page');
    const nextPageButton = document.getElementById('next-page');
    
    prevPageButton.addEventListener('click', () => {
        const pageNumList = document.querySelector('.page-num-list');
        const items = Array.from(pageNumList.children);
        console.log("From prevButton items:", items);
        const activeIndex = items.findIndex((item) => item.classList.contains('active'));
        console.log("activeIndex:", activeIndex);
        items[activeIndex].classList.remove('active');
        items[activeIndex-1].classList.add('active');
        currentQueries.page = activeIndex-1;
        loadDataList(currentQueries);
        updateVisibleItems();
    });

    nextPageButton.addEventListener('click', () => {
        const pageNumList = document.querySelector('.page-num-list');
        const items = Array.from(pageNumList.children);
        console.log("From nextButton items:", items);
        const activeIndex = items.findIndex((item) => item.classList.contains('active'));
        console.log("activeIndex:", activeIndex);
        items[activeIndex].classList.remove('active');
        items[activeIndex+1].classList.add('active');
        currentQueries.page = activeIndex+1;
        loadDataList(currentQueries);
        updateVisibleItems();
    })
}
// 페이지 이동 버튼 리스너 해제
function removeMovePageButton() {
    const prevPageButton = document.getElementById('prev-page');
    const nextPageButton = document.getElementById('next-page');
    
}

function updateVisibleItems() {
    const pageNumList = document.querySelector('.page-num-list');
    const items = Array.from(pageNumList.children);
    const activeIndex = items.findIndex((item) => item.classList.contains('active'));
    const prevPageButton = document.getElementById('prev-page');
    const nextPageButton = document.getElementById('next-page');

    if (items.length <= 1) {
        prevPageButton.style.opacity = '0';
        prevPageButton.style.pointerEvents = 'none';
        nextPageButton.style.opacity = '0';
        nextPageButton.style.pointerEvents = 'none';
    } else {
        if (activeIndex === 0) {
            prevPageButton.style.opacity = '0';
            prevPageButton.style.pointerEvents = 'none';
            nextPageButton.style.opacity = '1';
            nextPageButton.style.pointerEvents = 'auto';
        } else if (activeIndex === items.length - 1) {
            prevPageButton.style.opacity = '1';
            prevPageButton.style.pointerEvents = 'auto';
            nextPageButton.style.opacity = '0';
            nextPageButton.style.pointerEvents = 'none';
        } else {
            prevPageButton.style.opacity = '1';
            prevPageButton.style.pointerEvents = 'auto';
            nextPageButton.style.opacity = '1';
            nextPageButton.style.pointerEvents = 'auto';
        }
    }

    items.forEach((item, index) => {
        if (activeIndex < 2) {
            // activeIndex가 리스트 시작부 근처일 때
            item.style.display = index < 5 ? "flex" : "none";
        } else if (activeIndex >= items.length - 2) {
            // activeIndex가 리스트 끝 근처일 때
            item.style.display = index >= items.length - 5 ? "flex" : "none";
        } else {
            // activeIndex가 중간에 있을 때
            item.style.display = index >= activeIndex - 2 && index <= activeIndex + 2 ? "flex" : "none";
        }
    });
}

async function updateDomainList({ startDate = '', endDate = '' }) {
    const domainLength = 5;
    const result = [];

    const sendData = { type: "domain", k: domainLength, startDate: startDate, endDate: endDate };

    chrome.runtime.sendMessage({ senderName: "popup", action: "GET_STATISTICS", data: sendData }, (response) => {
        const data = response.data;
        if (data === null) {
            console.error(`GET_STATISTICS:domain: 데이터 요청 실패: ${response.message}`);
            return;
        }
        for (let i = 0; i < domainLength && data[i]; i++) {
            const domain = data[i];
            result.push(domain);
        }
        console.log("domainSet:" + result);
        const domainList = document.getElementById('domain-list');
        // 도메인 리스트에서 동적으로 추가된 항목만 삭제
        const dynamicItems = document.querySelectorAll('#domain-list .dynamic');
        if (dynamicItems) {
            dynamicItems.forEach(item => {
                item.remove();
            })
        }
        // 새로 받아온 도메인 리스트 추가
        result.forEach(domain => {
            const li = document.createElement('li');
            li.textContent = domain;
            li.classList.add('dynamic');
            li.setAttribute('data-value', `${domain}`);
            li.addEventListener('click', (event) => {
                event.stopPropagation();
                const domainMenu = document.getElementById('domain-menu');
                const domainLabel = document.getElementById('domain-label');
                const domainValue = event.target.getAttribute('data-value');
                domainMenu.style.display = 'none';
                domainMenu.parentElement.classList.remove('open');
                domainMenu.setAttribute('data-value', domainValue);
                domainLabel.textContent = domainValue;
            });
            domainList.appendChild(li);
        })
    });

}

function getPeriodOptions(period) {
    const currentDate = new Date();
    let start_date;
    let end_date;
    switch (period) {
        case 'a-day':
            start_date = getSubtractDate(currentDate, 0, 0, 1);
            end_date = currentDate;
            break;
        case 'a-week':
            start_date = getSubtractDate(currentDate, 0, 0, 7);
            end_date = currentDate;
            break;
        case 'a-month':
            start_date = getSubtractDate(currentDate, 0, 1);
            end_date = currentDate;
            break;
        case 'three-month':
            start_date = getSubtractDate(currentDate, 0, 3);
            end_date = currentDate;
            break;
        case 'a-year':
            start_date = getSubtractDate(currentDate, 1);
            end_date = currentDate;
            break;
        case 'user-defined-period':
            const startDateInput = document.getElementById('startDate');
            const endDateInput = document.getElementById('endDate');
            start_date = new Date(startDateInput.value);
            end_date = new Date(endDateInput.value);
            break;
        default:
            start_date = "";
            end_date = "";
            break;
    }
    return { startDate: start_date, endDate: end_date };
}