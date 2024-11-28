const autoSaveCheckbox = document.getElementById('autoSaveCheckbox');

chrome.storage.sync.get(['settingAutoSave']).then((result) => {
    autoSaveCheckbox.checked = result.settingAutoSave;
});

autoSaveCheckbox.addEventListener('change', () => {
    chrome.storage.sync.set({ settingAutoSave: autoSaveCheckbox.checked });
    chrome.storage.sync.get(['settingAutoSave'], (result) => {
        autoSaveCheckbox.checked = result.settingAutoSave;
    });
});