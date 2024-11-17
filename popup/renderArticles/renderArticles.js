

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
        title.href = article.link;
        title.target = '_blank';
        title.textContent = article.title;

        // 키워드
        const keywords = document.createElement('div');
        keywords.className = 'keywords';
        keywords.textContent = `Keywords: ${article.keywords.join(', ')}`;

        // 내용
        const content = document.createElement('div');
        content.className = 'content';
        content.textContent = article.short.join(' ');

        // 요소를 article div에 추가
        articleDiv.appendChild(title);
        articleDiv.appendChild(keywords);
        articleDiv.appendChild(content);

        // article div를 컨테이너에 추가
        container.appendChild(articleDiv);
    });

    return container;
}
