// Minecraft частицы
class MinecraftParticles {
    constructor() {
        this.canvas = document.createElement('canvas');
        this.canvas.id = 'particles-canvas';
        document.body.insertBefore(this.canvas, document.body.firstChild);
        
        this.ctx = this.canvas.getContext('2d');
        this.particles = [];
        this.particleCount = 30;
        
        this.resize();
        this.init();
        this.animate();
        
        window.addEventListener('resize', () => this.resize());
    }
    
    resize() {
        this.canvas.width = window.innerWidth;
        this.canvas.height = window.innerHeight;
    }
    
    init() {
        // Создаем частицы в стиле Minecraft (кубики)
        for (let i = 0; i < this.particleCount; i++) {
            this.particles.push({
                x: Math.random() * this.canvas.width,
                y: Math.random() * this.canvas.height,
                size: Math.random() * 15 + 5,
                speedX: (Math.random() - 0.5) * 0.5,
                speedY: Math.random() * 0.5 + 0.2,
                rotation: Math.random() * 360,
                rotationSpeed: (Math.random() - 0.5) * 2,
                opacity: Math.random() * 0.3 + 0.1,
                color: this.getRandomColor()
            });
        }
    }
    
    getRandomColor() {
        const colors = [
            'rgba(102, 126, 234, ',  // Фиолетовый
            'rgba(118, 75, 162, ',   // Темно-фиолетовый
            'rgba(255, 255, 255, ',  // Белый
            'rgba(139, 69, 19, ',    // Коричневый (земля)
            'rgba(34, 139, 34, ',    // Зеленый (трава)
        ];
        return colors[Math.floor(Math.random() * colors.length)];
    }
    
    drawCube(particle) {
        this.ctx.save();
        this.ctx.translate(particle.x, particle.y);
        this.ctx.rotate(particle.rotation * Math.PI / 180);
        
        // Рисуем пиксельный куб
        const size = particle.size;
        
        // Верхняя грань
        this.ctx.fillStyle = particle.color + (particle.opacity + 0.1) + ')';
        this.ctx.fillRect(-size/2, -size/2, size, size/3);
        
        // Левая грань
        this.ctx.fillStyle = particle.color + (particle.opacity - 0.05) + ')';
        this.ctx.fillRect(-size/2, -size/6, size/3, size);
        
        // Правая грань
        this.ctx.fillStyle = particle.color + particle.opacity + ')';
        this.ctx.fillRect(-size/6, -size/6, size/3, size);
        
        this.ctx.restore();
    }
    
    update() {
        this.particles.forEach(particle => {
            particle.x += particle.speedX;
            particle.y += particle.speedY;
            particle.rotation += particle.rotationSpeed;
            
            // Возвращаем частицы, вышедшие за границы
            if (particle.y > this.canvas.height + particle.size) {
                particle.y = -particle.size;
                particle.x = Math.random() * this.canvas.width;
            }
            if (particle.x > this.canvas.width + particle.size) {
                particle.x = -particle.size;
            }
            if (particle.x < -particle.size) {
                particle.x = this.canvas.width + particle.size;
            }
        });
    }
    
    draw() {
        this.ctx.clearRect(0, 0, this.canvas.width, this.canvas.height);
        this.particles.forEach(particle => this.drawCube(particle));
    }
    
    animate() {
        this.update();
        this.draw();
        requestAnimationFrame(() => this.animate());
    }
}

// Инициализируем частицы после загрузки страницы
window.addEventListener('load', () => {
    new MinecraftParticles();
});

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

// Плавающая кнопка чата
const chatBtn = document.getElementById('chatBtn');
const chatPopup = document.getElementById('chatPopup');
const chatCloseBtn = document.getElementById('chatCloseBtn');
const chatForm = document.getElementById('chatForm');
const chatInput = document.getElementById('chatInput');
const chatMessages = document.getElementById('chatMessages');

// WebSocket connection
let ws = null;
let reconnectInterval = null;
let wsEnabled = false; // Отключаем WebSocket по умолчанию

// WebSocket URL - замените на адрес вашего сервера
const WS_URL = 'ws://localhost:3000'; // Для локальной разработки
// const WS_URL = 'wss://your-server.com'; // Для продакшена

function connectWebSocket() {
    if (!wsEnabled) return; // Не подключаемся, если отключено
    
    try {
        ws = new WebSocket(WS_URL);
        
        ws.onopen = () => {
            console.log('Connected to chat server');
            if (reconnectInterval) {
                clearInterval(reconnectInterval);
                reconnectInterval = null;
            }
        };
        
        ws.onmessage = (event) => {
            try {
                const data = JSON.parse(event.data);
                
                if (data.type === 'admin_message') {
                    addMessage(data.text, 'bot');
                } else if (data.type === 'system') {
                    console.log('System:', data.message);
                }
            } catch (error) {
                console.error('Error parsing message:', error);
            }
        };
        
        ws.onerror = (error) => {
            console.error('WebSocket error:', error);
        };
        
        ws.onclose = () => {
            console.log('Disconnected from chat server');
            // Try to reconnect every 5 seconds
            if (!reconnectInterval && wsEnabled) {
                reconnectInterval = setInterval(() => {
                    console.log('Attempting to reconnect...');
                    connectWebSocket();
                }, 5000);
            }
        };
    } catch (error) {
        console.error('Failed to create WebSocket:', error);
    }
}

// Подключаемся только если включено
if (wsEnabled) {
    connectWebSocket();
}

if (chatBtn && chatPopup) {
    chatBtn.addEventListener('click', function() {
        chatPopup.classList.toggle('active');
        if (chatPopup.classList.contains('active')) {
            chatInput.focus();
        }
    });
    
    if (chatCloseBtn) {
        chatCloseBtn.addEventListener('click', function() {
            chatPopup.classList.remove('active');
        });
    }
    
    // Закрытие при клике вне окна
    document.addEventListener('click', function(e) {
        if (!chatPopup.contains(e.target) && !chatBtn.contains(e.target)) {
            chatPopup.classList.remove('active');
        }
    });
}

// Обработка отправки сообщения
if (chatForm) {
    chatForm.addEventListener('submit', async function(e) {
        e.preventDefault();
        
        const message = chatInput.value.trim();
        if (!message) return;
        
        // Добавляем сообщение пользователя в чат
        addMessage(message, 'user');
        chatInput.value = '';
        
        // Отправляем через WebSocket
        if (ws && ws.readyState === WebSocket.OPEN) {
            ws.send(JSON.stringify({
                type: 'user_message',
                text: message,
                timestamp: new Date().toISOString()
            }));
        } else {
            addMessage('Ошибка подключения. Попробуйте позже.', 'bot');
        }
    });
}

function addMessage(text, type) {
    const messageDiv = document.createElement('div');
    messageDiv.className = `chat-message ${type}-message`;
    
    const avatar = document.createElement('div');
    avatar.className = 'message-avatar';
    avatar.textContent = type === 'user' ? '👤' : '🤖';
    
    const content = document.createElement('div');
    content.className = 'message-content';
    
    const p = document.createElement('p');
    p.textContent = text;
    
    const time = document.createElement('span');
    time.className = 'message-time';
    time.textContent = new Date().toLocaleTimeString('ru-RU', { hour: '2-digit', minute: '2-digit' });
    
    content.appendChild(p);
    content.appendChild(time);
    messageDiv.appendChild(avatar);
    messageDiv.appendChild(content);
    
    chatMessages.appendChild(messageDiv);
    chatMessages.scrollTop = chatMessages.scrollHeight;
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
        
        // Сохраняем запрос в localStorage
        const requests = JSON.parse(localStorage.getItem('supportRequests') || '[]');
        const newRequest = {
            id: Date.now().toString(),
            username: username,
            email: email,
            category: category,
            message: message,
            timestamp: new Date().toISOString(),
            status: 'new'
        };
        requests.push(newRequest);
        localStorage.setItem('supportRequests', JSON.stringify(requests));
        
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


// Проверка авторизации и отображение пользователя
function checkAuth() {
    const currentUser = JSON.parse(localStorage.getItem('currentUser'));
    const loginLink = document.getElementById('login-link');
    const userMenuContainer = document.getElementById('user-menu-container');
    const usernameDisplay = document.getElementById('username-display');
    const adminMenuLink = document.getElementById('admin-menu-link');
    const logoutBtn = document.getElementById('logout-btn');
    
    console.log('checkAuth called', { currentUser, loginLink, userMenuContainer });
    
    if (currentUser && loginLink && userMenuContainer) {
        // Скрываем кнопку входа
        loginLink.style.display = 'none';
        
        // Показываем меню пользователя
        userMenuContainer.style.display = 'flex';
        
        // Отображаем роль пользователя
        let roleIcon = '👤';
        if (currentUser.role === 'owner') roleIcon = '👑';
        else if (currentUser.role === 'admin') roleIcon = '⚙️';
        
        usernameDisplay.textContent = `${roleIcon} ${currentUser.username}`;
        
        // Показываем админ панель для админов и создателей
        if ((currentUser.role === 'admin' || currentUser.role === 'owner') && adminMenuLink) {
            adminMenuLink.style.display = 'block';
        }
        
        // Выпадающее меню
        const userMenuToggle = document.getElementById('user-menu-toggle');
        const userMenuContent = document.getElementById('user-menu-content');
        
        console.log('Menu elements', { userMenuToggle, userMenuContent });
        
        if (userMenuToggle && userMenuContent) {
            userMenuToggle.addEventListener('click', (e) => {
                e.stopPropagation();
                console.log('Toggle clicked');
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
        
        // Обработчик выхода
        if (logoutBtn) {
            logoutBtn.addEventListener('click', () => {
                if (confirm('Выйти из аккаунта?')) {
                    localStorage.removeItem('currentUser');
                    window.location.reload();
                }
            });
        }
    }
}

// Проверяем авторизацию при загрузке страницы
document.addEventListener('DOMContentLoaded', checkAuth);
