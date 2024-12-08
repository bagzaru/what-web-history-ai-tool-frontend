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
    loadDataList(currentQueries);
    addMovePageButton();
});

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
        }, (response) => {
        const data = response.data;
        if (data === null) {
            console.log("데이터 요청 실패: " + response.message);
        }
        else {
            console.log("데이터 요청 성공");
        }
        console.log("데이터: " + JSON.stringify(data));
        resetData();
        const articles = renderArticles(data.content);
        articleContainer.appendChild(articles);
        if (pageNumList.children.length === 0) {
            renderPaging(data.totalPages);
        }
        const elementTop = articleContainer.offsetTop - 70;
        window.scrollTo({ top: elementTop, behavior:'smooth'});
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