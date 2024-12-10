

// 데이터를 렌더링하는 함수
export default function renderArticles(data) {
    const container = document.createElement('div');

    data.forEach(article => {
        // article div 생성
        const articleDiv = document.createElement('div');
        articleDiv.className = 'article';

        // article 상단바
        // 해당 데이터 삭제 버튼, 데이터의 카테고리, 데이터에 해당하는 URL로 이동하는 버튼
        const topMenu = document.createElement('div');
        topMenu.className = 'top-menu';
        // 리다이렉트 버튼
        const redirectButton = document.createElement('button');
        redirectButton.className = 'top-menu-btn';
        redirectButton.title = '웹에서 해당 페이지 열기';
        const redirectIcon = document.createElement('img');
        redirectIcon.src = '../../assets/compass-outline.svg';
        redirectButton.appendChild(redirectIcon);
        // 카테고리
        const category = document.createElement('div');
        category.className = 'category';
        category.textContent = `${article.category}`;
        // 삭제 버튼
        const deleteButton = document.createElement('button');
        deleteButton.className = 'top-menu-btn';
        deleteButton.title = '이 데이터 삭제';
        const deleteIcon = document.createElement('img');
        deleteIcon.src = '../../assets/close-outline.svg';
        deleteButton.appendChild(deleteIcon);
        // top menu 구성
        topMenu.appendChild(redirectButton);
        topMenu.appendChild(category);
        topMenu.appendChild(deleteButton);

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
            if (index < 5) {
                const keywordBox = document.createElement('div');
                keywordBox.className = 'keyword';
                keywordBox.textContent = keyword
                keywordsContainer.appendChild(keywordBox);
            }
            // const keywordBox = document.createElement('div');
            // keywordBox.className = 'keyword';
            // keywordBox.textContent = keyword
            // keywordsContainer.appendChild(keywordBox);
        });

        // 내용
        const content = document.createElement('div');
        content.className = 'content';
        content.textContent = article.shortSummary;

        // 요소를 article div에 추가
        articleDiv.appendChild(topMenu);
        articleDiv.appendChild(title);
        articleDiv.appendChild(keywordsContainer);
        articleDiv.appendChild(content);

        // article div를 컨테이너에 추가
        container.appendChild(articleDiv);
    });

    return container;
}
