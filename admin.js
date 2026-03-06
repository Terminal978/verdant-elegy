// Панель администратора

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

// Загрузка статистики
function loadStats() {
    const users = JSON.parse(localStorage.getItem('users') || '[]');
    const admins = users.filter(u => u.role === 'admin').length;
    const regular = users.filter(u => u.role === 'user').length;
    
    document.getElementById('total-users').textContent = users.length;
    document.getElementById('total-admins').textContent = admins;
    document.getElementById('total-regular').textContent = regular;
}

// Загрузка списка пользователей
function loadUsers() {
    const users = JSON.parse(localStorage.getItem('users') || '[]');
    const tbody = document.getElementById('users-list');
    
    tbody.innerHTML = '';
    
    users.forEach((user, index) => {
        const tr = document.createElement('tr');
        tr.innerHTML = `
            <td>${user.username}</td>
            <td>${user.email}</td>
            <td>${user.minecraft}</td>
            <td>
                <select class="role-select" data-index="${index}">
                    <option value="user" ${user.role === 'user' ? 'selected' : ''}>Пользователь</option>
                    <option value="admin" ${user.role === 'admin' ? 'selected' : ''}>Администратор</option>
                </select>
            </td>
            <td>
                <button class="delete-user-btn" data-index="${index}">🗑️ Удалить</button>
            </td>
        `;
        tbody.appendChild(tr);
    });
    
    // Обработчики для изменения роли
    document.querySelectorAll('.role-select').forEach(select => {
        select.addEventListener('change', (e) => {
            const index = parseInt(e.target.dataset.index);
            const users = JSON.parse(localStorage.getItem('users') || '[]');
            users[index].role = e.target.value;
            localStorage.setItem('users', JSON.stringify(users));
            loadStats();
            alert('✅ Роль изменена');
        });
    });
    
    // Обработчики для удаления
    document.querySelectorAll('.delete-user-btn').forEach(btn => {
        btn.addEventListener('click', (e) => {
            const index = parseInt(e.target.dataset.index);
            const users = JSON.parse(localStorage.getItem('users') || '[]');
            
            if (confirm(`Удалить пользователя ${users[index].username}?`)) {
                users.splice(index, 1);
                localStorage.setItem('users', JSON.stringify(users));
                loadUsers();
                loadStats();
                alert('✅ Пользователь удален');
            }
        });
    });
}

// Проверка статуса сервера
async function checkServerStatus() {
    try {
        const response = await fetch('https://api.mcsrvstat.us/3/213.152.43.61:25775');
        const data = await response.json();
        const statusEl = document.getElementById('admin-server-status');
        
        if (data.online) {
            statusEl.innerHTML = '<span style="color: #27ae60;">🟢 Онлайн</span>';
        } else {
            statusEl.innerHTML = '<span style="color: #e74c3c;">🔴 Оффлайн</span>';
        }
    } catch (error) {
        document.getElementById('admin-server-status').innerHTML = '<span style="color: #f39c12;">⚠️ Ошибка проверки</span>';
    }
}

// Очистка всех пользователей (кроме админов)
document.getElementById('clear-users-btn').addEventListener('click', () => {
    if (confirm('⚠️ Удалить всех обычных пользователей? Администраторы останутся.')) {
        const users = JSON.parse(localStorage.getItem('users') || '[]');
        const adminsOnly = users.filter(u => u.role === 'admin');
        localStorage.setItem('users', JSON.stringify(adminsOnly));
        loadUsers();
        loadStats();
        alert('✅ Обычные пользователи удалены');
    }
});

// Кнопка "Заявки на администратора"
document.getElementById('check-applications-btn').addEventListener('click', () => {
    window.location.href = 'applications.html';
});

// Кнопка "Проверить запросы"
document.getElementById('check-support-btn').addEventListener('click', () => {
    window.location.href = 'requests.html';
});

// Кнопка "Редактировать правила"
document.getElementById('edit-rules-btn').addEventListener('click', () => {
    window.location.href = 'rules.html';
});

// Инициализация
loadStats();
loadUsers();
checkServerStatus();
