// Проверка доступа
const currentUser = JSON.parse(localStorage.getItem('currentUser'));

if (!currentUser || currentUser.role !== 'admin') {
    alert('❌ Доступ запрещен! Только для администраторов.');
    window.location.href = 'login.html';
}

// Отображаем имя пользователя
document.getElementById('username-display').textContent = `👤 ${currentUser.username}`;

// Выпадающее меню пользователя
const userMenuToggle = document.getElementById('user-menu-toggle');
const userMenuContent = document.getElementById('user-menu-content');

if (userMenuToggle && userMenuContent) {
    userMenuToggle.addEventListener('click', (e) => {
        e.stopPropagation();
        userMenuContent.classList.toggle('show');
    });

    // Закрытие меню при клике вне его
    document.addEventListener('click', () => {
        userMenuContent.classList.remove('show');
    });

    userMenuContent.addEventListener('click', (e) => {
        e.stopPropagation();
    });
}

// Выход
document.getElementById('logout-btn').addEventListener('click', () => {
    localStorage.removeItem('currentUser');
    window.location.href = 'index.html';
});

// Получаем заявки
function getApplications() {
    return JSON.parse(localStorage.getItem('adminApplications') || '[]');
}

// Сохраняем заявки
function saveApplications(applications) {
    localStorage.setItem('adminApplications', JSON.stringify(applications));
}

// Обновляем статистику
function updateStats() {
    const applications = getApplications();
    const pending = applications.filter(a => a.status === 'pending').length;
    const approved = applications.filter(a => a.status === 'approved').length;
    const rejected = applications.filter(a => a.status === 'rejected').length;
    
    document.getElementById('total-applications').textContent = applications.length;
    document.getElementById('pending-applications').textContent = pending;
    document.getElementById('approved-applications').textContent = approved;
    document.getElementById('rejected-applications').textContent = rejected;
}

// Обновляем кнопку статуса набора
function updateStatusButton() {
    const isOpen = localStorage.getItem('applicationsOpen') !== 'false';
    const btn = document.getElementById('toggle-status-btn');
    const statusText = document.getElementById('status-text');
    
    if (isOpen) {
        btn.className = 'toggle-status-btn open';
        statusText.textContent = '🔴 Закрыть набор';
    } else {
        btn.className = 'toggle-status-btn closed';
        statusText.textContent = '🟢 Открыть набор';
    }
}

// Переключение статуса набора
document.getElementById('toggle-status-btn').addEventListener('click', () => {
    const isOpen = localStorage.getItem('applicationsOpen') !== 'false';
    localStorage.setItem('applicationsOpen', !isOpen);
    updateStatusButton();
    alert(isOpen ? '🔴 Набор закрыт' : '🟢 Набор открыт');
});

// Отображаем заявки
function displayApplications(filter = 'all') {
    const applications = getApplications();
    const applicationsList = document.getElementById('applications-list');
    const noApplications = document.getElementById('no-applications');
    
    let filteredApplications = applications;
    if (filter !== 'all') {
        filteredApplications = applications.filter(a => a.status === filter);
    }
    
    if (filteredApplications.length === 0) {
        applicationsList.style.display = 'none';
        noApplications.style.display = 'block';
        return;
    }
    
    applicationsList.style.display = 'block';
    noApplications.style.display = 'none';
    applicationsList.innerHTML = '';
    
    // Сортируем по дате (новые сверху)
    filteredApplications.sort((a, b) => new Date(b.timestamp) - new Date(a.timestamp));
    
    filteredApplications.forEach(app => {
        const appCard = document.createElement('div');
        appCard.className = `application-card ${app.status}`;
        
        const date = new Date(app.timestamp);
        const formattedDate = date.toLocaleString('ru-RU', {
            day: '2-digit',
            month: '2-digit',
            year: 'numeric',
            hour: '2-digit',
            minute: '2-digit'
        });
        
        const statusBadges = {
            pending: '⏳ На рассмотрении',
            approved: '✅ Одобрено',
            rejected: '❌ Отклонено'
        };
        
        appCard.innerHTML = `
            <div class="application-header">
                <div class="application-info">
                    <h3>👤 ${app.minecraftNick}</h3>
                    <span class="application-date">📅 ${formattedDate}</span>
                </div>
                <div class="application-status-badge ${app.status}">
                    ${statusBadges[app.status]}
                </div>
            </div>
            
            <div class="application-body">
                <div class="application-grid">
                    <div class="application-field">
                        <strong>🎂 Возраст:</strong>
                        <p>${app.age} лет</p>
                    </div>
                    <div class="application-field">
                        <strong>💬 Discord:</strong>
                        <p>${app.discord}</p>
                    </div>
                    <div class="application-field">
                        <strong>⏱️ Время на сервере:</strong>
                        <p>${app.playTime}</p>
                    </div>
                    <div class="application-field">
                        <strong>📅 Активность в день:</strong>
                        <p>${app.dailyHours}</p>
                    </div>
                </div>
                
                <div class="application-field">
                    <strong>🎓 Опыт администрирования:</strong>
                    <p class="application-text">${app.adminExperience}</p>
                </div>
                
                <div class="application-field">
                    <strong>💡 Мотивация:</strong>
                    <p class="application-text">${app.motivation}</p>
                </div>
                
                <div class="application-field">
                    <strong>⚖️ Конфликтная ситуация:</strong>
                    <p class="application-text">${app.conflictSituation}</p>
                </div>
                
                ${app.additionalInfo ? `
                    <div class="application-field">
                        <strong>📝 Дополнительно:</strong>
                        <p class="application-text">${app.additionalInfo}</p>
                    </div>
                ` : ''}
            </div>
            
            <div class="application-actions">
                ${app.status === 'pending' ? `
                    <button class="approve-btn" data-id="${app.id}">✅ Одобрить</button>
                    <button class="reject-btn" data-id="${app.id}">❌ Отклонить</button>
                ` : `
                    <button class="reset-btn" data-id="${app.id}">🔄 Вернуть на рассмотрение</button>
                `}
                <button class="delete-app-btn" data-id="${app.id}">🗑️ Удалить</button>
            </div>
        `;
        
        applicationsList.appendChild(appCard);
    });
    
    // Обработчики кнопок
    document.querySelectorAll('.approve-btn').forEach(btn => {
        btn.addEventListener('click', (e) => changeStatus(e.target.dataset.id, 'approved'));
    });
    
    document.querySelectorAll('.reject-btn').forEach(btn => {
        btn.addEventListener('click', (e) => changeStatus(e.target.dataset.id, 'rejected'));
    });
    
    document.querySelectorAll('.reset-btn').forEach(btn => {
        btn.addEventListener('click', (e) => changeStatus(e.target.dataset.id, 'pending'));
    });
    
    document.querySelectorAll('.delete-app-btn').forEach(btn => {
        btn.addEventListener('click', (e) => deleteApplication(e.target.dataset.id));
    });
}

// Изменить статус заявки
function changeStatus(id, status) {
    const applications = getApplications();
    const app = applications.find(a => a.id === id);
    if (app) {
        app.status = status;
        saveApplications(applications);
        updateStats();
        displayApplications(currentFilter);
        
        const messages = {
            approved: '✅ Заявка одобрена',
            rejected: '❌ Заявка отклонена',
            pending: '⏳ Заявка возвращена на рассмотрение'
        };
        alert(messages[status]);
    }
}

// Удалить заявку
function deleteApplication(id) {
    if (confirm('Удалить эту заявку?')) {
        let applications = getApplications();
        applications = applications.filter(a => a.id !== id);
        saveApplications(applications);
        updateStats();
        displayApplications(currentFilter);
    }
}

// Фильтры
let currentFilter = 'all';

document.querySelectorAll('.filter-btn').forEach(btn => {
    btn.addEventListener('click', (e) => {
        document.querySelectorAll('.filter-btn').forEach(b => b.classList.remove('active'));
        e.target.classList.add('active');
        currentFilter = e.target.dataset.filter;
        displayApplications(currentFilter);
    });
});

// Инициализация
updateStats();
updateStatusButton();
displayApplications();
