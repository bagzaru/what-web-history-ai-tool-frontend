//javaDateConverter.js: javascript의 date 형식을 java spring의 date 형식으로 변환

//java 형태로 date를 변환하는 함수
function getJavaDateString(date = new Date()) {
    const yyyy = date.getFullYear();
    const mm = String(date.getMonth() + 1).padStart(2, "0");
    const dd = String(date.getDate()).padStart(2, "0");
    const hh = String(date.getHours()).padStart(2, "0");
    const minmin = String(date.getMinutes()).padStart(2, "0");
    const ss = String(date.getSeconds()).padStart(2, "0");

    const res = `${yyyy}-${mm}-${dd}T${hh}:${minmin}:${ss}`;
    return res;
}

export default getJavaDateString;