// Система аутентификации

// Переключение между вкладками
document.querySelectorAll('.auth-tab').forEach(tab => {
    tab.addEventListener('click', () => {
        const tabName = tab.dataset.tab;
        
        // Переключаем активную вкладку
        document.querySelectorAll('.auth-tab').forEach(t => t.classList.remove('active'));
        tab.classList.add('active');
        
        // Переключаем формы
        document.querySelectorAll('.auth-form').forEach(form => form.classList.remove('active'));
        document.getElementById(`${tabName}-form`).classList.add('active');
    });
});

// Регистрация
document.getElementById('registerForm').addEventListener('submit', (e) => {
    e.preventDefault();
    
    const username = document.getElementById('register-username').value.trim();
    const email = document.getElementById('register-email').value.trim();
    const minecraft = document.getElementById('register-minecraft').value.trim();
    const password = document.getElementById('register-password').value;
    const confirm = document.getElementById('register-confirm').value;
    const messageEl = document.getElementById('register-message');
    
    // Проверка паролей
    if (password !== confirm) {
        messageEl.textContent = '❌ Пароли не совпадают';
        messageEl.style.color = '#e74c3c';
        return;
    }
    
    // Получаем существующих пользователей
    let users = JSON.parse(localStorage.getItem('users') || '[]');
    
    // Проверка на существующего пользователя
    if (users.find(u => u.username === username)) {
        messageEl.textContent = '❌ Пользователь с таким именем уже существует';
        messageEl.style.color = '#e74c3c';
        return;
    }
    
    // Создаем нового пользователя
    const newUser = {
        username,
        email,
        minecraft,
        password, // В реальном приложении нужно хешировать!
        role: 'user',
        createdAt: new Date().toISOString()
    };
    
    users.push(newUser);
    localStorage.setItem('users', JSON.stringify(users));
    
    messageEl.textContent = '✅ Регистрация успешна! Теперь войдите в аккаунт';
    messageEl.style.color = '#27ae60';
    
    // Очищаем форму
    document.getElementById('registerForm').reset();
    
    // Переключаемся на вход через 2 секунды
    setTimeout(() => {
        document.querySelector('[data-tab="login"]').click();
    }, 2000);
});

// Вход
document.getElementById('loginForm').addEventListener('submit', (e) => {
    e.preventDefault();
    
    const username = document.getElementById('login-username').value.trim();
    const password = document.getElementById('login-password').value;
    const messageEl = document.getElementById('login-message');
    
    // Получаем пользователей
    const users = JSON.parse(localStorage.getItem('users') || '[]');
    
    // Ищем пользователя
    const user = users.find(u => u.username === username && u.password === password);
    
    if (user) {
        // Сохраняем текущего пользователя
        localStorage.setItem('currentUser', JSON.stringify(user));
        
        messageEl.textContent = '✅ Вход выполнен успешно!';
        messageEl.style.color = '#27ae60';
        
        // Перенаправляем
        setTimeout(() => {
            if (user.role === 'admin') {
                window.location.href = 'admin.html';
            } else {
                window.location.href = 'index.html';
            }
        }, 1000);
    } else {
        messageEl.textContent = '❌ Неверное имя пользователя или пароль';
        messageEl.style.color = '#e74c3c';
    }
});

// Создаем админа по умолчанию при первом запуске
if (!localStorage.getItem('users')) {
    const defaultAdmin = {
        username: 'admin',
        email: 'admin@verdantelegy.com',
        minecraft: 'Admin',
        password: 'admin123',
        role: 'admin',
        createdAt: new Date().toISOString()
    };
    localStorage.setItem('users', JSON.stringify([defaultAdmin]));
}
