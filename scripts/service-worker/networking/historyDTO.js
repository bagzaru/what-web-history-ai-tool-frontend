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