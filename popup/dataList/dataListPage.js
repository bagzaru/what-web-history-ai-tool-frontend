import renderArticles from "../renderArticles/renderArticles.js";

const articleContainer = document.getElementById('article-container');

document.addEventListener("DOMContentLoaded", async () => {
    await renderMenu();
});

function loadDataList() {
    chrome.runtime.sendMessage({ action: "GET_ALL_DATA_LIST" }, (response) => {
        const data = response.data;
        if (data === null) {
            console.log("데이터 요청 실패: " + response.message);
        }
        else {
            console.log("데이터 요청 성공");
        }
        console.log("데이터: " + JSON.stringify(data));
        const articles = renderArticles(data);
        articleContainer.innerHTML = "";
        articleContainer.appendChild(articles);
    });
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

    // 메뉴 리스트 요소 가져오기
    const menuList = document.querySelector('.menu-list');

    // 리스트 항목을 동적으로 추가
    list.forEach(item => {
        const listItem = document.createElement('li');
        listItem.textContent = item; // 항목 텍스트
        listItem.onclick = () => alert(`You clicked: ${item}`); // 클릭 시 동작 추가
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


loadDataList();