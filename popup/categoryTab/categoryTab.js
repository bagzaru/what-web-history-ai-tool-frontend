let categories = ["게임", "학습", "엔터테인먼트", "업무", "뉴스", "소셜", "기타"]

document.addEventListener("DOMContentLoaded", function () {
    // 저장된 카테고리 리스트를 보여줌.
    categories.forEach((category) => {
        addCategoryItem(category);
    });
});

function addCategoryItem(category) {
    const categoryList = document.getElementById('category-list');
    const categoryItem = document.createElement('div'); // <div> 생성
    categoryItem.className = 'category-item';           // 클래스 추가

    const input = document.createElement('input');      // <input> 생성
    input.type = 'text';
    input.value = category;                             // 텍스트 값 설정
    input.readOnly = true;                              // 초기 상태 = 읽기 전용

    // 삭제 버튼 이미지
    const deleteImg = document.createElement('img');
    deleteImg.className = 'button-img';
    deleteImg.src = '../../assets/close-outline.svg';
    deleteImg.alt = 'delete';


    const button = document.createElement('button');
    button.appendChild(deleteImg);                        // 버튼 텍스트 설정
    button.tabIndex = '-1';

    // 각 카테고리 텍스트 박스를 클릭시 포커싱 효과 추가
    input.addEventListener('click', () => {
        input.readOnly = false;  // 읽기 전용 해제
        input.focus();
    });

    // 포커스 해제 시
    input.addEventListener('blur', () => {
        input.readOnly = true;   //다시 읽기 전용으로
    })

    input.addEventListener('keydown', (event) => {
        if(event.key === 'Enter'){
            event.preventDefault();
        }
    })

    categoryItem.appendChild(input);
    categoryItem.appendChild(button);
    categoryList.appendChild(categoryItem);
}