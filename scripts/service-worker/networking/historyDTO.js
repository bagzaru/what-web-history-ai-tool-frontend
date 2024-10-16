//historyDTO.js: history와 관련된 DTO 형태를 저장하는 파일

function createHistoryDTO(title, content, url, spentTime, visitTime) {
    return {
        title: title,
        content: content,
        url: url,
        spentTime: spentTime,
        visitTime: visitTime
    };
}


export { createHistoryDTO };