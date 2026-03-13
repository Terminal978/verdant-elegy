// Система аутентификации

// Инициализация EmailJS (замените на ваши ключи после регистрации)
// Зарегистрируйтесь на https://www.emailjs.com/
const EMAILJS_PUBLIC_KEY = 'GjveuICDkyYlNcyNS'; // Замените после регистрации
const EMAILJS_SERVICE_ID = 'service_10cc4te'; // Замените после регистрации
const EMAILJS_TEMPLATE_ID = 'template_dfbojj8'; // Замените после регистрации
let verificationCode = '';
let verifiedEmail = '';

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
        
        // Сбрасываем состояние формы регистрации
        resetRegistrationForm();
    });
});

// Сброс формы регистрации
function resetRegistrationForm() {
    verificationCode = '';
    verifiedEmail = '';
    document.getElementById('register-code').style.display = 'none';
    document.getElementById('register-minecraft').style.display = 'none';
    document.getElementById('password-container-1').style.display = 'none';
    document.getElementById('password-container-2').style.display = 'none';
    document.getElementById('register-submit-btn').style.display = 'none';
    document.getElementById('send-code-btn').style.display = 'block';
    document.getElementById('register-message').textContent = '';
}

// Отправка кода на email
document.getElementById('send-code-btn').addEventListener('click', async () => {
    const username = document.getElementById('register-username').value.trim();
    const email = document.getElementById('register-email').value.trim();
    const messageEl = document.getElementById('register-message');
    
    if (!username || !email) {
        messageEl.textContent = '❌ Заполните имя пользователя и email';
        messageEl.style.color = '#e74c3c';
        return;
    }
    
    // Проверка на существующего пользователя
    const users = JSON.parse(localStorage.getItem('users') || '[]');
    if (users.find(u => u.username === username)) {
        messageEl.textContent = '❌ Пользователь с таким именем уже существует';
        messageEl.style.color = '#e74c3c';
        return;
    }
    
    if (users.find(u => u.email === email)) {
        messageEl.textContent = '❌ Email уже используется';
        messageEl.style.color = '#e74c3c';
        return;
    }
    
    // Генерируем 6-значный код
    verificationCode = Math.floor(100000 + Math.random() * 900000).toString();
    
    messageEl.textContent = '📧 Отправка кода...';
    messageEl.style.color = '#3498db';
    
    // Отправляем email через EmailJS
    try {
        // Инициализируем EmailJS
        emailjs.init(EMAILJS_PUBLIC_KEY);
        
        const templateParams = {
            to_email: email,
            to_name: username,
            verification_code: verificationCode,
            site_name: 'Verdant Elegy'
        };
        
        await emailjs.send(EMAILJS_SERVICE_ID, EMAILJS_TEMPLATE_ID, templateParams);
        
        verifiedEmail = email;
        messageEl.textContent = '✅ Код отправлен на ' + email;
        messageEl.style.color = '#27ae60';
        
        // Показываем поле для ввода кода
        document.getElementById('register-code').style.display = 'block';
        document.getElementById('register-code').focus();
        document.getElementById('send-code-btn').textContent = '🔄 Отправить код повторно';
        
    } catch (error) {
        console.error('Ошибка отправки email:', error);
        
        // ВРЕМЕННОЕ РЕШЕНИЕ: Показываем код в консоли для тестирования
        console.log('🔑 Код для тестирования:', verificationCode);
        
        verifiedEmail = email;
        messageEl.textContent = '⚠️ EmailJS не настроен. Код для тестирования: ' + verificationCode;
        messageEl.style.color = '#f39c12';
        
        // Показываем поле для ввода кода
        document.getElementById('register-code').style.display = 'block';
        document.getElementById('register-code').focus();
        document.getElementById('send-code-btn').textContent = '🔄 Отправить код повторно';
    }
});

// Проверка кода при вводе
document.getElementById('register-code').addEventListener('input', (e) => {
    const code = e.target.value.trim();
    const messageEl = document.getElementById('register-message');
    
    if (code.length === 6) {
        if (code === verificationCode) {
            messageEl.textContent = '✅ Email подтвержден!';
            messageEl.style.color = '#27ae60';
            
            // Показываем остальные поля
            document.getElementById('register-minecraft').style.display = 'block';
            document.getElementById('password-container-1').style.display = 'flex';
            document.getElementById('password-container-2').style.display = 'flex';
            document.getElementById('register-submit-btn').style.display = 'block';
            document.getElementById('register-code').disabled = true;
            document.getElementById('send-code-btn').style.display = 'none';
        } else {
            messageEl.textContent = '❌ Неверный код';
            messageEl.style.color = '#e74c3c';
        }
    }
});

// Регистрация
document.getElementById('registerForm').addEventListener('submit', (e) => {
    e.preventDefault();
    
    const username = document.getElementById('register-username').value.trim();
    const email = verifiedEmail;
    const minecraft = document.getElementById('register-minecraft').value.trim();
    const password = document.getElementById('register-password').value;
    const confirm = document.getElementById('register-confirm').value;
    const messageEl = document.getElementById('register-message');
    
    // Проверка что email подтвержден
    if (!verifiedEmail) {
        messageEl.textContent = '❌ Сначала подтвердите email';
        messageEl.style.color = '#e74c3c';
        return;
    }
    
    // Проверка паролей
    if (password !== confirm) {
        messageEl.textContent = '❌ Пароли не совпадают';
        messageEl.style.color = '#e74c3c';
        return;
    }
    
    // Получаем существующих пользователей
    let users = JSON.parse(localStorage.getItem('users') || '[]');
    
    // Создаем нового пользователя
    const newUser = {
        username,
        email,
        minecraft,
        password, // В реальном приложении нужно хешировать!
        role: 'user',
        createdAt: new Date().toISOString(),
        emailVerified: true
    };
    
    users.push(newUser);
    localStorage.setItem('users', JSON.stringify(users));
    
    console.log('✅ Новый пользователь зарегистрирован:', newUser);
    console.log('📊 Всего пользователей:', users.length);
    
    messageEl.textContent = '✅ Регистрация успешна! Теперь войдите в аккаунт';
    messageEl.style.color = '#27ae60';
    
    // Очищаем форму
    document.getElementById('registerForm').reset();
    resetRegistrationForm();
    
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

// Создаем создателя по умолчанию при первом запуске
if (!localStorage.getItem('users')) {
    const defaultOwner = {
        username: 'admin',
        email: 'admin@verdantelegy.com',
        minecraft: 'Admin',
        password: 'admin123',
        role: 'owner',
        createdAt: new Date().toISOString()
    };
    localStorage.setItem('users', JSON.stringify([defaultOwner]));
}


// Переключение видимости пароля
document.querySelectorAll('.toggle-password').forEach(button => {
    button.addEventListener('click', function() {
        const targetId = this.dataset.target;
        const input = document.getElementById(targetId);
        const icon = this.querySelector('.eye-icon');
        
        if (input.type === 'password') {
            input.type = 'text';
            icon.textContent = '🙈';
        } else {
            input.type = 'password';
            icon.textContent = '👁️';
        }
    });
});
