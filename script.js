// Переключатель темы
const themeToggle = document.getElementById('themeToggle');
const body = document.body;

// Проверяем сохраненную тему
const savedTheme = localStorage.getItem('theme');
if (savedTheme === 'dark') {
    body.classList.add('dark-theme');
}

if (themeToggle) {
    themeToggle.addEventListener('click', function() {
        body.classList.toggle('dark-theme');
        
        // Сохраняем выбор пользователя
        if (body.classList.contains('dark-theme')) {
            localStorage.setItem('theme', 'dark');
        } else {
            localStorage.setItem('theme', 'light');
        }
    });
}

// Копирование IP адреса
const serverIP = document.getElementById('serverIP');
if (serverIP) {
    serverIP.addEventListener('click', async function() {
        const ip = this.textContent.trim();
        
        try {
            await navigator.clipboard.writeText(ip);
            
            // Визуальная обратная связь
            this.classList.add('copied');
            
            // Показываем уведомление
            const notification = document.createElement('div');
            notification.textContent = 'IP скопирован!';
            notification.style.cssText = `
                position: fixed;
                top: 20px;
                right: 20px;
                background: #4ade80;
                color: white;
                padding: 15px 25px;
                border-radius: 8px;
                font-weight: bold;
                z-index: 1000;
                animation: slideIn 0.3s ease;
                box-shadow: 0 4px 12px rgba(0,0,0,0.2);
            `;
            
            document.body.appendChild(notification);
            
            // Убираем уведомление через 2 секунды
            setTimeout(() => {
                notification.style.animation = 'slideOut 0.3s ease';
                setTimeout(() => notification.remove(), 300);
            }, 2000);
            
            // Убираем класс copied через 2 секунды
            setTimeout(() => {
                this.classList.remove('copied');
            }, 2000);
            
        } catch (err) {
            console.error('Ошибка копирования:', err);
            alert('IP адрес: ' + ip);
        }
    });
}

// Проверка статуса сервера
async function checkServerStatus() {
    const statusElement = document.getElementById('serverStatus');
    const onlineInfo = document.getElementById('onlineInfo');
    const playerCount = document.getElementById('playerCount');
    const maxPlayers = document.getElementById('maxPlayers');
    
    if (!statusElement) return;
    
    try {
        // Используем публичный API для проверки статуса Minecraft серверов
        const response = await fetch('https://api.mcsrvstat.us/3/213.152.43.61:25775');
        const data = await response.json();
        
        if (data.online) {
            statusElement.textContent = 'Онлайн';
            statusElement.className = 'status-online';
            
            if (data.players) {
                playerCount.textContent = data.players.online || 0;
                maxPlayers.textContent = data.players.max || 0;
                onlineInfo.style.display = 'block';
            }
        } else {
            statusElement.textContent = 'Оффлайн';
            statusElement.className = 'status-offline';
            onlineInfo.style.display = 'none';
        }
    } catch (error) {
        console.error('Ошибка проверки статуса:', error);
        statusElement.textContent = 'Недоступен';
        statusElement.className = 'status-offline';
        onlineInfo.style.display = 'none';
    }
}

// Проверяем статус при загрузке страницы
if (document.getElementById('serverStatus')) {
    checkServerStatus();
    // Обновляем статус каждые 30 секунд
    setInterval(checkServerStatus, 30000);
}

// Плавная прокрутка к секциям (для якорей на той же странице)
document.querySelectorAll('a[href^="#"]').forEach(anchor => {
    anchor.addEventListener('click', function (e) {
        e.preventDefault();
        const target = document.querySelector(this.getAttribute('href'));
        if (target) {
            target.scrollIntoView({
                behavior: 'smooth',
                block: 'start'
            });
        }
    });
});

// Обработка формы поддержки
const supportForm = document.getElementById('supportForm');
if (supportForm) {
    supportForm.addEventListener('submit', async function(e) {
        e.preventDefault();
        
        const username = document.getElementById('username').value;
        const email = document.getElementById('email').value;
        const category = document.getElementById('category').value;
        const message = document.getElementById('message').value;
        
        // Discord Webhook URL - замените на ваш webhook
        const webhookURL = 'https://discord.com/api/webhooks/1478731364726607993/9GU0koyRtbyYqYB3muEgW3hO0ugfsROZRjSJmxnxR0CBPKmhEyQwAJ445_XVsXBiwZ1c';
        
        // Категории на русском
        const categoryNames = {
            'bug': 'Баг/Ошибка',
            'grief': 'Жалоба на игрока',
            'question': 'Вопрос',
            'other': 'Другое'
        };
        
        // Формируем embed для Discord
        const discordMessage = {
            embeds: [{
                title: '📩 Новый запрос в поддержку',
                color: 6724095, // Фиолетовый цвет
                fields: [
                    {
                        name: '👤 Игрок',
                        value: username,
                        inline: true
                    },
                    {
                        name: '📧 Email',
                        value: email,
                        inline: true
                    },
                    {
                        name: '📂 Категория',
                        value: categoryNames[category] || category,
                        inline: false
                    },
                    {
                        name: '💬 Сообщение',
                        value: message,
                        inline: false
                    }
                ],
                timestamp: new Date().toISOString(),
                footer: {
                    text: 'Verdant Elegy Support'
                }
            }]
        };
        
        try {
            const response = await fetch(webhookURL, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify(discordMessage)
            });
            
            if (response.ok) {
                alert('Спасибо! Ваш запрос отправлен. Мы ответим в ближайшее время.');
                this.reset();
            } else {
                throw new Error('Ошибка отправки');
            }
        } catch (error) {
            console.error('Ошибка:', error);
            alert('Произошла ошибка при отправке. Попробуйте позже или свяжитесь с нами в Discord.');
        }
    });
}

// Анимация появления элементов при скролле
const observerOptions = {
    threshold: 0.1,
    rootMargin: '0px 0px -50px 0px'
};

const observer = new IntersectionObserver(function(entries) {
    entries.forEach(entry => {
        if (entry.isIntersecting) {
            entry.target.style.opacity = '1';
            entry.target.style.transform = 'translateY(0)';
        }
    });
}, observerOptions);

document.querySelectorAll('section').forEach(section => {
    section.style.opacity = '0';
    section.style.transform = 'translateY(20px)';
    section.style.transition = 'opacity 0.6s ease, transform 0.6s ease';
    observer.observe(section);
});
