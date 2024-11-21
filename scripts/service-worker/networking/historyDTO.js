//historyDTO.js: history와 관련된 DTO 형태를 저장하는 파일

function createDetailedHistoryResponseDTO(id, url, title, visitTime, shortSummary, longSummary, keywords, spentTime, visitCount) {
    return {
        id: id,
        url: url,
        title: title,
        visitTime: visitTime,
        shortSummary: shortSummary,
        longSummary: longSummary,
        keywords: keywords,
        spentTime: spentTime,
        visitCount: visitCount
    }
}

function createHistoryRequestDTO(url, content) {
    return {
        url: url,
        content: content
    };
}

function createHistoryResponseDTO(id, url, title, visitTime, shortSummary) {
    return {
        id: id,
        url: url,
        title: title,
        visitTime: visitTime,
        shortSummary: shortSummary
    };
}

export { createDetailedHistoryResponseDTO, createHistoryRequestDTO, createHistoryResponseDTO };