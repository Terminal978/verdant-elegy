// Загрузка состава команды

// Проверка авторизации
function checkAuth() {
    const currentUser = JSON.parse(localStorage.getItem('currentUser'));
    const loginLink = document.getElementById('login-link');
    const userMenuContainer = document.getElementById('user-menu-container');
    const usernameDisplay = document.getElementById('username-display');
    const adminMenuLink = document.getElementById('admin-menu-link');
    const logoutBtn = document.getElementById('logout-btn');
    
    if (currentUser && loginLink && userMenuContainer) {
        loginLink.style.display = 'none';
        userMenuContainer.style.display = 'flex';
        usernameDisplay.textContent = `👤 ${currentUser.username}`;
        
        if ((currentUser.role === 'admin' || currentUser.role === 'owner') && adminMenuLink) {
            adminMenuLink.style.display = 'block';
        }
        
        const userMenuToggle = document.getElementById('user-menu-toggle');
        const userMenuContent = document.getElementById('user-menu-content');
        
        if (userMenuToggle && userMenuContent) {
            userMenuToggle.addEventListener('click', (e) => {
                e.stopPropagation();
                userMenuContent.classList.toggle('show');
            });
            
            document.addEventListener('click', () => {
                userMenuContent.classList.remove('show');
            });
            
            userMenuContent.addEventListener('click', (e) => {
                e.stopPropagation();
            });
        }
        
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

// Загрузка контента команды
function loadTeamContent() {
    const teamContent = document.getElementById('team-content');
    const savedContent = localStorage.getItem('teamContent');
    
    if (savedContent) {
        teamContent.innerHTML = savedContent;
    } else {
        teamContent.innerHTML = getDefaultTeamContent();
    }
}

// Контент по умолчанию
function getDefaultTeamContent() {
    return `
<div class="team-intro">
    <p>Наша команда состоит из опытных и преданных администраторов, которые работают над тем, чтобы сделать ваш игровой опыт незабываемым.</p>
</div>

<div class="team-category">
    <h3>👑 Создатель проекта</h3>
    <div class="team-grid">
        <div class="team-member">
            <div class="member-avatar">👑</div>
            <div class="member-info">
                <h4 class="member-name">Admin</h4>
                <p class="member-role">Создатель и владелец</p>
                <p class="member-description">Основатель сервера Verdant Elegy. Отвечает за общее развитие проекта и принятие ключевых решений.</p>
            </div>
        </div>
    </div>
</div>

<div class="team-category">
    <h3>🏆 Главный администратор</h3>
    <div class="team-grid">
        <div class="team-member">
            <div class="member-avatar">🏆</div>
            <div class="member-info">
                <h4 class="member-name">Имя главного администратора</h4>
                <p class="member-role">Главный администратор</p>
                <p class="member-description">Руководит командой администрации, принимает важные решения и координирует работу сервера.</p>
            </div>
        </div>
    </div>
</div>

<div class="team-category">
    <h3>🛠️ Модераторы</h3>
    <div class="team-grid">
        <div class="team-member">
            <div class="member-avatar">🛠️</div>
            <div class="member-info">
                <h4 class="member-name">Имя модератора</h4>
                <p class="member-role">Модератор</p>
                <p class="member-description">Следит за порядком на сервере, помогает игрокам и решает конфликтные ситуации.</p>
            </div>
        </div>
    </div>
</div>

<div class="team-category">
    <h3>⚙️ Администраторы</h3>
    <div class="team-grid">
        <div class="team-member">
            <div class="member-avatar">⚙️</div>
            <div class="member-info">
                <h4 class="member-name">Имя администратора</h4>
                <p class="member-role">Администратор</p>
                <p class="member-description">Помогает поддерживать порядок в чате и следит за соблюдением правил.</p>
            </div>
        </div>
    </div>
</div>

<div class="team-join">
    <h3>🌟 Хочешь присоединиться к команде?</h3>
    <p>Мы всегда ищем ответственных и активных игроков для пополнения нашей команды!</p>
    <a href="apply.html" class="join-team-btn">⚡ Подать заявку</a>
</div>
`;
}

// Инициализация
checkAuth();
loadTeamContent();
