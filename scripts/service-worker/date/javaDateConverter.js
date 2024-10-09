
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