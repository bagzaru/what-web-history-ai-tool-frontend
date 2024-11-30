let categories = ["게임", "학습", "엔터테인먼트", "업무", "뉴스", "소셜", "기타"]

document.addEventListener("DOMContentLoaded", function () {
    // 저장된 카테고리 리스트를 보여줌.
    categories.forEach((category) => {
        addCategoryItem(category);
    });
});

const addButton = document.getElementById('add-category-button');
const newCategoryInput = document.getElementById('new-category-name');
const invalidateErrorMessage = document.getElementById('invalidate-error-message');
const duplicateErrorMessage = document.getElementById('duplicate-error-message');

addButton.addEventListener('click', () => {
    if (checkValidateInput() && checkDuplicatedInput(newCategoryInput.value)){
        addCategoryItem(newCategoryInput.value);
        newCategoryInput.value = "";
        newCategoryInput.focus();
        newCategoryInput.scrollIntoView({behavior: 'smooth', block: 'center'});
    }
});

newCategoryInput.addEventListener('keydown', (event) => {
    if(event.key === 'Enter' && checkValidateInput() && checkDuplicatedInput(newCategoryInput.value)){
        event.preventDefault();
        addCategoryItem(newCategoryInput.value);
        newCategoryInput.value = "";
        newCategoryInput.focus();
        newCategoryInput.scrollIntoView({behavior: 'smooth', block: 'center'});
        checkDuplicatedInput();
    }
});

function checkValidateInput() {
    if (newCategoryInput.value.trim() === '') {
        newCategoryInput.classList.add('error');
        invalidateErrorMessage.style.display = 'block';
        duplicateErrorMessage.style.display = 'none';
        newCategoryInput.focus();
        return false;
    } else {
        newCategoryInput.classList.remove('error');
        invalidateErrorMessage.style.display = 'none';
        return true;
    }
}

function checkDuplicatedInput(input) {
    const categories = document.querySelectorAll('.category-item input');
    for (const category of categories) {
        const existCategoryName = category.value.trim();
        if (input === existCategoryName) {
            newCategoryInput.classList.add('error');
            duplicateErrorMessage.style.display = 'block';
            category.focus();
            console.log('duplicated!');
            return false; // 중복 발견 시 false 반환
        }
    }
    console.log('success!');
    newCategoryInput.classList.remove('error');
    duplicateErrorMessage.style.display = 'none';
    return true;
}

//카테고리 추가
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


    const delButton = document.createElement('button');
    delButton.appendChild(deleteImg);                        // 버튼 텍스트 설정
    delButton.tabIndex = '-1';

    // 삭제 동작
    delButton.addEventListener('click', (event) => {
        const parent = event.target.parentElement;
        parent.style.opacity = '0';
        setTimeout(() => {
            parent.remove();
        }, 200);
    });

    // 각 카테고리 텍스트 박스를 클릭시 포커싱 효과 추가
    input.addEventListener('click', () => {
        input.readOnly = false;  // 읽기 전용 해제
        input.focus();
    });

    // 포커스 해제 시
    input.addEventListener('blur', () => {
        input.readOnly = true;   //다시 읽기 전용으로
    });

    

    categoryItem.appendChild(input);
    categoryItem.appendChild(delButton);
    categoryList.appendChild(categoryItem);
}