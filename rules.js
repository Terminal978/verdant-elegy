// Загрузка правил сервера
function loadRules() {
    const savedRules = localStorage.getItem('serverRules');
    
    if (savedRules) {
        document.getElementById('rules-content').innerHTML = savedRules;
    }
}

// Загружаем правила при загрузке страницы
loadRules();
