
document.addEventListener("DOMContentLoaded", async () => {
    //chrome storage에 저장된 카테고리 리스트 가져오기
    const categories = await getCategories();
    // 저장된 카테고리 리스트를 보여줌.
    categories.forEach((category) => {
        if (category !== '기타'){
            addCategoryItem(category);
        }
    });
    const saveButton = document.getElementById('save-button');
    saveButton.addEventListener('click', () => {
        chrome.runtime.sendMessage({ senderName: "popup", action: "GET_ALL_CATEGORIES" }, async (response) => {
            const data = response.data;
            if (data === null) {
                console.error(`GET_ALL_CATEGORIES: 데이터 요청 실패: ${response.message}`);
                return;
            }
            await storeUserCategories(data);
            window.top.location.reload();
        });
    })
    getCurrentCategoryList();
});

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

const addButton = document.getElementById('add-category-button');
const newCategoryInput = document.getElementById('new-category-name');
const applyButton = document.getElementById('save-button');
const invalidateErrorMessage = document.getElementById('invalidate-error-message');
const duplicateErrorMessage = document.getElementById('duplicate-error-message');
const somethingChangedMessage = document.getElementById('something-changed-message');

addButton.addEventListener('click', () => {
    if (checkValidateInput() && checkDuplicatedInput(newCategoryInput.value)){
        newCategoryInput.style.opacity = '0.5';
        newCategoryInput.style.pointerEvents = 'none';
        addButton.style.opacity = '0.5';
        addButton.style.pointerEvents = 'none';
        const categoryName = newCategoryInput.value.trim();
        chrome.runtime.sendMessage({ senderName: "popup", action: "ADD_CATEGORY", data: categoryName }, async (response) => {
            const data = response.data;
            if (data === null) {
                console.error(`GET_ALL_CATEGORIES: 데이터 요청 실패: ${response.message}`);
                newCategoryInput.style.opacity = '1';
                newCategoryInput.style.pointerEvents = 'auto';
                addButton.style.opacity = '1';
                addButton.style.pointerEvents = 'auto';
                return;
            }
            addCategoryItem(categoryName);
            const newCategoryLIst = getCurrentCategoryList();
            await storeUserCategories(newCategoryLIst);
            newCategoryInput.style.opacity = '1';
            newCategoryInput.style.pointerEvents = 'auto';
            addButton.style.opacity = '1';
            addButton.style.pointerEvents = 'auto';
            newCategoryInput.value = "";
            newCategoryInput.scrollIntoView({behavior: 'smooth', block: 'center'});
            somethingChangedMessage.style.display = 'block';
            applyButton.style.opacity = '1';
            applyButton.style.pointerEvents = 'auto';
        });
    }
});

newCategoryInput.addEventListener('keydown', (event) => {
    if(event.key === 'Enter' && checkValidateInput() && checkDuplicatedInput(newCategoryInput.value)){
        event.preventDefault();
        newCategoryInput.style.opacity = '0.5';
        newCategoryInput.style.pointerEvents = 'none';
        addButton.style.opacity = '0.5';
        addButton.style.pointerEvents = 'none';
        const categoryName = newCategoryInput.value.trim();
        chrome.runtime.sendMessage({ senderName: "popup", action: "ADD_CATEGORY", data: categoryName }, async (response) => {
            const data = response.data;
            if (data === null) {
                console.error(`GET_ALL_CATEGORIES: 데이터 요청 실패: ${response.message}`);
                newCategoryInput.style.opacity = '1';
                newCategoryInput.style.pointerEvents = 'auto';
                addButton.style.opacity = '1';
                addButton.style.pointerEvents = 'auto';
                return;
            }
            addCategoryItem(categoryName);
            const newCategoryLIst = getCurrentCategoryList();
            await storeUserCategories(newCategoryLIst);
            newCategoryInput.style.opacity = '1';
            newCategoryInput.style.pointerEvents = 'auto';
            addButton.style.opacity = '1';
            addButton.style.pointerEvents = 'auto';
            newCategoryInput.value = "";
            newCategoryInput.scrollIntoView({behavior: 'smooth', block: 'center'});
            somethingChangedMessage.style.display = 'block';
            applyButton.style.opacity = '1';
            applyButton.style.pointerEvents = 'auto';
        });
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
        const existCategoryName = removeAllSpaces(category.value);
        if (removeAllSpaces(input) === existCategoryName) {
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

// 공백제거
function removeAllSpaces(input) {
    return input.replace(/\s+/g, '');
}

//카테고리 추가
function addCategoryItem(category) {
    const categoryList = document.getElementById('category-list');
    const categoryItem = document.createElement('div'); // <div> 생성
    categoryItem.className = 'category-item';           // 클래스 추가

    const input = document.createElement('input');      // <input> 생성
    input.type = 'text';
    input.setAttribute('data-original-value', category);
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
        const categoryName = input.getAttribute('data-original-value');
        input.style.opacity = '0.5';
        input.style.pointerEvents = 'none';
        event.target.style.opacity = '0.5';
        event.target.style.pointerEvents = 'none';

        chrome.runtime.sendMessage({ senderName: "popup", action: "DELETE_CATEGORY", data: categoryName }, async(response) => {
            const data = response.data;
            if (data === null) {
                console.error(`DELETE_CATEGORY: 카테고리 삭제 실패: ${response.message}`);
                input.style.opacity = '1';
                input.style.pointerEvents = 'auto';
                event.target.style.opacity = '1';
                event.target.style.pointerEvents = 'auto';
                return;
            }
            const newCategoryLIst = getCurrentCategoryList();
            await storeUserCategories(newCategoryLIst);
            console.log("categorySet:" + JSON.stringify(data));
            somethingChangedMessage.style.display = 'block';
            applyButton.style.opacity = '1';
            applyButton.style.pointerEvents = 'auto';
            const parent = event.target.parentElement;
            parent.style.opacity = '0';
            setTimeout(() => {
                parent.remove();
            }, 200);
        });
        input.style.pointerEvents = 'auto';
        input.style.opacity = '1';
        event.target.style.pointerEvents = 'auto';
        event.target.style.opacity = '1';
    });

    // 수정 버튼
    const editImg = document.createElement('img');
    editImg.className = 'button-img';
    editImg.src = '../../assets/create-outline.svg';
    editImg.alt = 'edit';

    const editButton = document.createElement('button');
    editButton.id = 'edit-category-button';
    editButton.tabIndex = '-1';
    editButton.style.display = 'none';
    editButton.addEventListener('click', (event) => {
        event.stopPropagation();
        const originalName = input.getAttribute('data-original-value')
        if (input.value !== originalName){
            input.style.pointerEvents = 'none';
            input.style.opacity = '0.5';
            event.target.style.opacity = '0.5';
            event.target.style.pointerEvents = 'none';
            chrome.runtime.sendMessage({ senderName: "popup", action: "UPDATE_CATEGORY", data: { originalName: originalName, newName: input.value } }, async(response) => {
                const data = response.data;
                if (data === null) {
                    console.error(`UPDATE_CATEGORY: 카테고리 수정 실패 : ${response.message}`);
                    input.style.pointerEvents = 'auto';
                    input.style.opacity = '1';
                    event.target.style.pointerEvents = 'auto';
                    event.target.style.opacity = '1';
                    return;
                }
                const newCategoryLIst = getCurrentCategoryList();
                await storeUserCategories(newCategoryLIst);
                console.log("categorySet:" + JSON.stringify(data));
                input.setAttribute('data-original-value', input.value);
                input.style.pointerEvents = 'auto';
                input.style.opacity = '1';
                event.target.style.pointerEvents = 'auto';
                event.target.style.opacity = '1';
                delButton.classList.remove('on-edit');
                editButton.style.display = 'none';
                somethingChangedMessage.style.display = 'block';
                applyButton.style.opacity = '1';
                applyButton.style.pointerEvents = 'auto';
            });
        } else {
            console.log('현재 이름과 동일합니다.');
        }
    });
    editButton.appendChild(editImg);

    // 각 카테고리 텍스트 박스를 클릭시 포커싱 효과 추가
    input.addEventListener('click', () => {
        input.readOnly = false;  // 읽기 전용 해제
        delButton.classList.add('on-edit');
        editButton.style.display = 'flex';
        input.focus();
    });

    // 포커스 해제 시
    input.addEventListener('blur', () => {
        setTimeout(() => {
            input.readOnly = true;   //다시 읽기 전용으로
            delButton.classList.remove('on-edit');
            editButton.style.display = 'none';
        }, 200);
    });

    

    categoryItem.appendChild(input);
    categoryItem.appendChild(editButton);
    categoryItem.appendChild(delButton);
    categoryList.appendChild(categoryItem);
}

function getCurrentCategoryList() {
    const listContainer = document.getElementById('category-list');
    const list = listContainer.querySelectorAll('.category-item');
    let result = [];
    list.forEach(category => {
        const eachInput = category.querySelector('input');
        result.push(eachInput.value);
    })
    console.log(result);
    return result;
}

function storeUserCategories(categories) {
    return new Promise ((resolve, reject) => {
        chrome.storage.sync.set({ categories: categories}, () => {
            if (chrome.runtime.lastError) {
                reject (new Error(chrome.runtime.lastError));
            } else {
                resolve();
            }
        });
    });
}