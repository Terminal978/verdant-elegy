// Проверка доступа
const currentUser = JSON.parse(localStorage.getItem('currentUser'));

if (!currentUser || (currentUser.role !== 'admin' && currentUser.role !== 'owner')) {
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

// Получаем запросы из localStorage
function getRequests() {
    return JSON.parse(localStorage.getItem('supportRequests') || '[]');
}

// Сохраняем запросы
function saveRequests(requests) {
    localStorage.setItem('supportRequests', JSON.stringify(requests));
}

// Обновляем статистику
function updateStats() {
    const requests = getRequests();
    const newRequests = requests.filter(r => r.status === 'new').length;
    const processedRequests = requests.filter(r => r.status === 'processed').length;
    
    document.getElementById('total-requests').textContent = requests.length;
    document.getElementById('new-requests').textContent = newRequests;
    document.getElementById('processed-requests').textContent = processedRequests;
}

// Отображаем запросы
function displayRequests(filter = 'all') {
    const requests = getRequests();
    const requestsList = document.getElementById('requests-list');
    const noRequests = document.getElementById('no-requests');
    
    let filteredRequests = requests;
    if (filter === 'new') {
        filteredRequests = requests.filter(r => r.status === 'new');
    } else if (filter === 'processed') {
        filteredRequests = requests.filter(r => r.status === 'processed');
    }
    
    if (filteredRequests.length === 0) {
        requestsList.style.display = 'none';
        noRequests.style.display = 'block';
        return;
    }
    
    requestsList.style.display = 'block';
    noRequests.style.display = 'none';
    requestsList.innerHTML = '';
    
    // Сортируем по дате (новые сверху)
    filteredRequests.sort((a, b) => new Date(b.timestamp) - new Date(a.timestamp));
    
    filteredRequests.forEach((request, index) => {
        const requestCard = document.createElement('div');
        requestCard.className = `request-card ${request.status}`;
        
        const categoryNames = {
            'bug': 'Баг/Ошибка',
            'grief': 'Жалоба на игрока',
            'question': 'Вопрос',
            'other': 'Другое'
        };
        
        const categoryIcons = {
            'bug': '🐛',
            'grief': '⚠️',
            'question': '❓',
            'other': '📝'
        };
        
        const date = new Date(request.timestamp);
        const formattedDate = date.toLocaleString('ru-RU', {
            day: '2-digit',
            month: '2-digit',
            year: 'numeric',
            hour: '2-digit',
            minute: '2-digit'
        });
        
        requestCard.innerHTML = `
            <div class="request-header">
                <div class="request-info">
                    <span class="request-category">${categoryIcons[request.category] || '📝'} ${categoryNames[request.category] || request.category}</span>
                    <span class="request-date">📅 ${formattedDate}</span>
                </div>
                <div class="request-status-badge ${request.status}">
                    ${request.status === 'new' ? '🆕 Новый' : '✅ Обработан'}
                </div>
            </div>
            <div class="request-body">
                <div class="request-field">
                    <strong>👤 Игрок:</strong> ${request.username}
                </div>
                <div class="request-field">
                    <strong>📧 Email:</strong> ${request.email}
                </div>
                <div class="request-field">
                    <strong>💬 Сообщение:</strong>
                    <p class="request-message">${request.message}</p>
                </div>
            </div>
            <div class="request-actions">
                ${request.status === 'new' ? 
                    `<button class="mark-processed-btn" data-id="${request.id}">✅ Отметить обработанным</button>` : 
                    `<button class="mark-new-btn" data-id="${request.id}">🔄 Вернуть в новые</button>`
                }
                <button class="delete-request-btn" data-id="${request.id}">🗑️ Удалить</button>
            </div>
        `;
        
        requestsList.appendChild(requestCard);
    });
    
    // Обработчики кнопок
    document.querySelectorAll('.mark-processed-btn').forEach(btn => {
        btn.addEventListener('click', (e) => {
            const id = e.target.dataset.id;
            markAsProcessed(id);
        });
    });
    
    document.querySelectorAll('.mark-new-btn').forEach(btn => {
        btn.addEventListener('click', (e) => {
            const id = e.target.dataset.id;
            markAsNew(id);
        });
    });
    
    document.querySelectorAll('.delete-request-btn').forEach(btn => {
        btn.addEventListener('click', (e) => {
            const id = e.target.dataset.id;
            deleteRequest(id);
        });
    });
}

// Отметить как обработанный
function markAsProcessed(id) {
    const requests = getRequests();
    const request = requests.find(r => r.id === id);
    if (request) {
        request.status = 'processed';
        saveRequests(requests);
        updateStats();
        displayRequests(currentFilter);
    }
}

// Вернуть в новые
function markAsNew(id) {
    const requests = getRequests();
    const request = requests.find(r => r.id === id);
    if (request) {
        request.status = 'new';
        saveRequests(requests);
        updateStats();
        displayRequests(currentFilter);
    }
}

// Удалить запрос
function deleteRequest(id) {
    if (confirm('Удалить этот запрос?')) {
        let requests = getRequests();
        requests = requests.filter(r => r.id !== id);
        saveRequests(requests);
        updateStats();
        displayRequests(currentFilter);
    }
}

// Очистить все запросы
document.getElementById('clear-all-requests').addEventListener('click', () => {
    if (confirm('⚠️ Удалить ВСЕ запросы? Это действие нельзя отменить!')) {
        localStorage.removeItem('supportRequests');
        updateStats();
        displayRequests(currentFilter);
        alert('✅ Все запросы удалены');
    }
});

// Фильтры
let currentFilter = 'all';

document.querySelectorAll('.filter-btn').forEach(btn => {
    btn.addEventListener('click', (e) => {
        document.querySelectorAll('.filter-btn').forEach(b => b.classList.remove('active'));
        e.target.classList.add('active');
        currentFilter = e.target.dataset.filter;
        displayRequests(currentFilter);
    });
});

// Инициализация
updateStats();
displayRequests();
