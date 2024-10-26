const goBackButton = document.getElementById("go-back-button");
goBackButton.addEventListener('click', () => {
    history.back();
})