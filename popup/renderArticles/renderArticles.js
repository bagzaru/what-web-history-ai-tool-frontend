
// 데이터를 렌더링하는 함수
export default function renderArticles(data, categories) {
    const container = document.createElement('div');
    categories.unshift('변경안함');
    data.forEach(article => {
        // article div 생성
        const articleDiv = document.createElement('div');
        articleDiv.className = 'article';
        articleDiv.id = article.id;

        // article 상단바
        // 해당 데이터 삭제 버튼, 데이터의 카테고리, 데이터에 해당하는 URL로 이동하는 버튼
        const topMenu = document.createElement('div');
        topMenu.className = 'top-menu';
        // 리다이렉트 버튼
        const redirectButton = document.createElement('button');
        redirectButton.className = 'top-menu-btn';
        redirectButton.title = '브라우저에서 열기';
        const redirectIcon = document.createElement('img');
        redirectIcon.src = '../../assets/compass-outline.svg';
        redirectButton.addEventListener('click', (event) => {
            event.stopPropagation();
            window.open(article.url, '_blank');
        })
        redirectButton.appendChild(redirectIcon);
        // 카테고리
        const category = document.createElement('div');
        category.className = 'category';
        category.id = `${article.id}-category`;
        category.textContent = `${article.category}`;
        // 삭제 버튼
        const deleteButton = document.createElement('button');
        deleteButton.className = 'top-menu-btn';
        deleteButton.title = '이 데이터 삭제';
        const deleteIcon = document.createElement('img');
        deleteIcon.src = '../../assets/close-outline.svg';
        deleteButton.addEventListener('click', (event) => {
            event.stopPropagation();
            const parent = document.getElementById(`${article.id}`);
            parent.style.opacity = '0.5';
            chrome.runtime.sendMessage({ senderName: "popup", action: "DELETE_HISTORY_DATA", data: article.url }, (response) => {
                const data = response.data;
                if (data === null) {
                    console.error(`DELETE_HISTORY_DATA 데이터 삭제 실패: ${response.message}`);
                    parent.style.opacity = '1';
                    return;
                }
                console.log("데이터 삭제 성공: " + data);
                parent.style.opacity = '0';
                setTimeout(() => {
                    parent.remove();
                }, 200);
            });
        })
        deleteButton.appendChild(deleteIcon);
        // top menu 구성
        topMenu.appendChild(redirectButton);
        topMenu.appendChild(category);
        topMenu.appendChild(deleteButton);

        const visitTime = document.createElement('div');
        visitTime.className = 'visit-time';
        visitTime.textContent = `${article.visitTime.split('.')[0]} 에 마지막 방문`;

        // 제목
        const title = document.createElement('div');
        title.className = 'title';
        title.href = article.url;
        title.target = '_blank';
        if (article.title === null) {
            article.title = "제목 없음";
        }
        title.textContent = article.title;

        // 키워드 컨테이너
        const keywordsContainer = document.createElement('div');
        keywordsContainer.className = 'keywords-container'
        article.keywords.forEach ((keyword, index) => {
            //한글 키워드만
            if (index < 5) {
                const keywordBox = document.createElement('div');
                keywordBox.className = 'keyword';
                keywordBox.textContent = keyword
                keywordsContainer.appendChild(keywordBox);
            }
            //영어 키워드도 포함
            // const keywordBox = document.createElement('div');
            // keywordBox.className = 'keyword';
            // keywordBox.textContent = keyword
            // keywordsContainer.appendChild(keywordBox);
        });

        // 내용
        const content = document.createElement('div');
        content.className = 'content';
        content.textContent = article.shortSummary;

        // 방문 횟수 표시 div
        const visitCountContainer = document.createElement('div');
        visitCountContainer.className = 'visit-count';
        visitCountContainer.style.display = 'none';

        // 체류 시간 표시 div
        const spentTimeContainer = document.createElement('div');
        spentTimeContainer.className = 'spent-time';
        spentTimeContainer.style.display = 'none';

        // 바닥 메뉴 (상세보기 버튼, 해당 데이터의 카테고리를 수정하는 메뉴가 있음)
        const showDetailButton = document.createElement('button');
        showDetailButton.className = 'show-detail-button';
        showDetailButton.textContent = '더 자세한 내용 보기';
        showDetailButton.addEventListener('click', (event) => {
            event.stopPropagation();
            content.style.opacity = '0.5';
            showDetailButton.style.opacity = '0.5';
            showDetailButton.style.pointerEvents = 'none';
            chrome.runtime.sendMessage({ senderName: "popup", action: "GET_DETAIL_DATA", data: article.id }, (response) => {
                const data = response.data;
                if (data === null) {
                    console.error(`GET_DETAIL_DATA 상세 데이터 로드 실패: ${response.message}`);
                    showDetailButton.style.opacity = '1';
                    showDetailButton.style.pointerEvents = 'auto';
                    content.style.opacity = '1';
                    return;
                }
                console.log("상세 데이터 로드 성공: " + data);
                const spentTime = data.spentTime;
                content.style.opacity = '1';
                content.textContent = data.longSummary;
                showDetailButton.style.display = 'none';
                visitCountContainer.textContent = `이 페이지를 총 ${data.visitCount}번 방문했습니다.`;
                visitCountContainer.style.display = 'flex';
                spentTimeContainer.textContent = `이 페이지에서 ${Math.floor(spentTime/60)}분 ${spentTime%60}초 머물렀습니다`;
                spentTimeContainer.style.display = 'flex';
            });
        })

        // 카테고리 수정 컨테이너
        const modifyCategoryContainer = document.createElement('div');
        modifyCategoryContainer.className = 'modify-category-container';
        // 카테고리 수정 설명
        const modifyCategoryLabel = document.createElement('div');
        modifyCategoryLabel.className = 'modify-category-label';
        modifyCategoryLabel.textContent = '이 데이터의 카테고리를 수정';
        // 카테고리 선택 드롭다운
        const categoryDropdown = document.createElement('div');
        categoryDropdown.className = 'render-ariticle-dropdown';
        categoryDropdown.setAttribute('data-value', 'category-menu');
        const dropdownLabel = document.createElement('span');
        dropdownLabel.className = 'render-ariticle-dropdown-label';
        dropdownLabel.textContent = '카테고리 선택';
        const dropdownArrow = document.createElement('span');
        dropdownArrow.className = 'render-ariticle-dropdown-arrow';
        const dropdownMenu = document.createElement('div');
        dropdownMenu.className = 'render-ariticle-dropdown-menu';
        dropdownMenu.id = 'category-menu';
        dropdownMenu.setAttribute('data-value', article.category);
        const ul = document.createElement('ul');
        dropdownMenu.appendChild(ul);
        categoryDropdown.appendChild(dropdownLabel);
        categoryDropdown.appendChild(dropdownArrow);
        categoryDropdown.appendChild(dropdownMenu);

        categoryDropdown.addEventListener('click', (event) => {
            event.stopPropagation();
            if (categoryDropdown.classList.contains('open')){
                dropdownMenu.style.display = 'none';
                categoryDropdown.classList.remove('open');
            } else {
                dropdownMenu.style.display = 'block';
                categoryDropdown.classList.add('open');
            }
        })
        categories.forEach(category => {
            const li = document.createElement('li');
            li.setAttribute('data-value', category);
            li.textContent = category;
            li.addEventListener('click', (event) => {
                event.stopPropagation();
                const selectedOption = li.textContent;
                const selectedValue = li.getAttribute('data-value');
                dropdownLabel.textContent = selectedOption;
                dropdownMenu.style.display = 'none';
                dropdownMenu.setAttribute('data-value', `${selectedValue}`);
                categoryDropdown.classList.remove('open');
            })
            ul.appendChild(li);
        });

        // 카테고리 수정 버튼
        const modifyCategoryButton = document.createElement('button');
        modifyCategoryButton.className = 'modify-category-button';
        modifyCategoryButton.textContent = '수정';
        modifyCategoryButton.addEventListener('click', (event) => {
            event.stopPropagation();
            const parent = event.target.parentElement;
            const targetElement = parent.querySelector('#category-menu');
            if (targetElement) {
                const newCategory = targetElement.getAttribute('data-value');
                const upperParent = document.getElementById(`${article.id}`);
                const upperParentCategoryLabel = document.getElementById(`${article.id}-category`);
                upperParent.style.opacity = "0.5"
                chrome.runtime.sendMessage({ senderName: "popup", action: "UPDATE_HISTORY_DATA", data: {url:article.url, category:newCategory} }, (response) => {
                    const data = response.data;
                    if (data === null) {
                        console.error(`UPDATE_HISTORY_DATA 데이터 업데이트 실패: ${response.message}`);
                        upperParent.style.opacity = '1';
                        return;
                    }
                    console.log("데이터 업데이트 성공: " + data.category);
                    upperParent.style.opacity = '1';
                    upperParentCategoryLabel.textContent = data.category;
                });
            }
        })
        // 카테고리 수정 메뉴에 append
        modifyCategoryContainer.appendChild(modifyCategoryLabel);
        modifyCategoryContainer.appendChild(categoryDropdown);
        modifyCategoryContainer.appendChild(modifyCategoryButton);


        // 요소를 article div에 추가
        articleDiv.appendChild(topMenu);
        articleDiv.appendChild(visitTime);
        articleDiv.appendChild(title);
        articleDiv.appendChild(keywordsContainer);
        articleDiv.appendChild(content);
        articleDiv.appendChild(showDetailButton);
        articleDiv.appendChild(visitCountContainer);
        articleDiv.appendChild(spentTimeContainer);
        articleDiv.appendChild(modifyCategoryContainer);

        // 기본값 display = none
        showDetailButton.style.display = 'none';
        modifyCategoryContainer.style.display = 'none';

        articleDiv.addEventListener('click', (event) => {
            if (content.classList.contains('content-open')){
                content.classList.remove('content-open');
                content.textContent = article.shortSummary;
                showDetailButton.style.display = 'none';
                showDetailButton.style.opacity = '1';
                showDetailButton.style.pointerEvents = 'auto';
                modifyCategoryContainer.style.display = 'none';
                visitCountContainer.style.display = 'none';
                spentTimeContainer.style.display = 'none';
                if (categoryDropdown.classList.contains('open')){
                    dropdownMenu.style.display = 'none';
                    categoryDropdown.classList.remove('open');
                }
            } else {
                content.classList.add('content-open');
                showDetailButton.style.display = 'flex';
                modifyCategoryContainer.style.display = 'flex';
            }
        })

        // article div를 컨테이너에 추가
        container.appendChild(articleDiv);
    });

    return container;
}
