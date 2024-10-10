//localHistoryDB에 저장할 것들
const historyFrame = {
    title: title,
    content: content,
    url: url,
    spentTime: spentTime,
    visitTime: visitTime
}

function createHistoryBody(title, content, url, spentTime, visitTime) {
    return {
        title: title,
        content: content,
        url: url,
        spentTime: spentTime,
        visitTime: visitTime
    };
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

export { historyFrame, createHistoryBody };