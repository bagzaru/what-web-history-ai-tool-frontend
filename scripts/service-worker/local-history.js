//localHistoryDB에 저장할 것들
const historyFrame = {
    visitTime: "",
    title: "",
    url: "",
    timeOnPage: "",
    pageData: ""
}

async function loadLocalHistoryDB() {
    const key = 'localHistoryDB';
    let localHistoryData = [];

    //load하여 localHistoryData 배열에 저장.
    localHistoryData = await new Promise((resolve, reject) => {
        chrome.storage.local.get([key], (result) => {
            if (chrome.runtime.lastError) {
                return reject(chrome.runtime.lastError);
            }
            resolve(result[key]);
        })
    });

    return localHistoryData;
}

export { historyFrame };