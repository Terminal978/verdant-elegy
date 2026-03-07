// Загрузка содержимого страницы "О нас"
function loadAboutContent() {
    const savedContent = localStorage.getItem('aboutContent');
    
    if (savedContent) {
        document.getElementById('about-content').innerHTML = savedContent;
    }
}

// Загружаем содержимое при загрузке страницы
loadAboutContent();
