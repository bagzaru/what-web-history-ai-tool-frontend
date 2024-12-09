

// 데이터를 렌더링하는 함수
export default function renderArticles(data) {
    const container = document.createElement('div');

    data.forEach(article => {
        // article div 생성
        const articleDiv = document.createElement('div');
        articleDiv.className = 'article';

        // 제목
        const title = document.createElement('a');
        title.className = 'title';
        title.href = article.url;
        title.target = '_blank';
        if (article.title === null) {
            article.title = "제목 없음";
        }
        title.textContent = article.title;

        // 키워드
        const keywords = document.createElement('div');
        keywords.className = 'keywords';
        keywords.textContent = `Keywords: ${article.keywords.join(', ')}`;

        // 카테고리
        const category = document.createElement('div');
        category.className = 'category';
        category.textContent = `Category: ${article.category}`;

        // 내용
        const content = document.createElement('div');
        content.className = 'content';
        content.textContent = article.shortSummary;

        // 요소를 article div에 추가
        articleDiv.appendChild(category);
        articleDiv.appendChild(title);
        articleDiv.appendChild(keywords);
        articleDiv.appendChild(content);

        // article div를 컨테이너에 추가
        container.appendChild(articleDiv);
    });

    return container;
}
