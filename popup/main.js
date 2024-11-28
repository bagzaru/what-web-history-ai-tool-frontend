// function changeStyle() {
//     this.onClick = function() {
//         var list = this.parentNode.childNodes;
//         for(var i = 0; i < list.length; i++){
//             if(list[i].nodeType === 1 && list[i].className === 'active'){
//                 list[i].className="";
//             }
//         }
//         this.className='active';
//     }
// }


// var tabs = document.getElementById('tabnav').childNodes;
// for(var i = 0; i < tabs.length; i++){
//     if (tabs[i].nodeType === 1){
//         changeStyle.call(tabs[i]);
//     }
// }

// Main.html의 DOM 트리가 완성되는 즉시 로그인 상태에 따라 렌더링 변경
// window.onload 보다 이전 시점
document.addEventListener("DOMContentLoaded", function () {
    chrome.storage.local.get(["jwtToken", "user_email", "user_picture"], (result) => {
        if (result.jwtToken) {
            console.log("jwtToken이 존재합니다:", result.jwtToken);
            // 로그인 상태일 시, 로그인 탭이 보이지 않게 됨
            document.getElementById("login-frame").style.display = "none";
            document.getElementById("login-tab").style.display = "none";
            // 탭의 기본 값이 검색 창이 됨.
            document.getElementById("login-tab").classList.remove("active");
            document.getElementById("search-tab").classList.add("active");
            // 사용자 정보 보여주기
            const img = document.getElementById("user-icon");
            img.src = result.user_picture;
            const email_text = document.getElementById("user-name");
            email_text.innerText = result.user_email;
            email_text.title = result.user_email;
        } else {
            console.log("jwtToken이 존재하지 않습니다:");
            // 로그아웃 상태일 시 사용자 정보 박스 및 로그아웃 버튼이 보이지 않음
            document.getElementById("login-info").style.display = "none";
            // 로그아웃 상태에서는 로그인 이외의 탭 들도 보이지 않아야 함
            document.getElementById("search-frame").style.display = "none";
            document.getElementById("search-tab").style.display = "none";
            document.getElementById("showall-frame").style.display = "none";
            document.getElementById("showall-tab").style.display = "none";
            document.getElementById("setting-frame").style.display = "none";
            document.getElementById("setting-tab").style.display = "none";
            document.getElementById("temp-frame").style.display = "none";
            document.getElementById("temp-tab").style.display = "none";
        }
    });
})

function changeStyle() {
    this.addEventListener("click", function () {
        const list = this.parentNode.children;
        for (let item of list) {
            if (item.classList.contains("active")) {
                item.classList.remove("active");
                item.classList.add("normal")
            }
        }
        this.classList.add("active");
    });
}

const tabs = document.getElementById("tabnav").children;
for (let tab of tabs) {
    changeStyle.call(tab);
}

const logoutButton = document.getElementById("logout-btn");
logoutButton.addEventListener('click', async () => {
    try {
        const response = await new Promise((resolve, reject) => {
            chrome.runtime.sendMessage({ action: "LOGOUT_REQUEST" }, (response) => {
                if (chrome.runtime.lastError) {
                    reject(chrome.runtime.lastError);
                } else {
                    resolve(response);
                }
            });
        });
        console.log("response data:", response);
        if (response.data === true) {
            console.log("From main.js : Logout Success");
            window.parent.location.reload();
        } else {
            console.log("From main.js : Logout Failed");
        }
    } catch (error) {
        console.error("Logout request failed:", error);
    }
})