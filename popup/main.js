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

function changeStyle() {
    this.addEventListener("click", function() {
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