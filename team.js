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
    
    // Сбрасываем старый контент если он содержит вложенные карточки (баг старой версии)
    if (savedContent && savedContent.includes('class="team-member"') && savedContent.indexOf('class="team-member"') !== savedContent.lastIndexOf('class="team-member"')) {
        const nested = (savedContent.match(/class="team-member"/g) || []).length;
        const grids = (savedContent.match(/class="team-grid"/g) || []).length;
        if (nested > grids * 2) {
            localStorage.removeItem('teamContent');
            teamContent.innerHTML = getDefaultTeamContent();
            return;
        }
    }
    
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
    <h3>👑 Руководство</h3>
    <div class="team-grid">
        <div class="team-member">
            <div class="member-avatar">👑</div>
            <div class="member-info">
                <h4 class="member-name">Kapychinooo</h4>
                <p class="member-role">Создатель и владелец</p>
                <p class="member-description">Основатель сервера Verdant Elegy. Отвечает за общее развитие проекта и принятие ключевых решений.</p>
            </div>
        </div>
        <div class="team-member">
            <div class="member-avatar">💎</div>
            <div class="member-info">
                <h4 class="member-name">kaktus_001</h4>
                <p class="member-role">Руководитель проекта</p>
                <p class="member-description">Отвечает за помощь основателю, помогает ему в управлении сервером.</p>
            </div>
        </div>
        <div class="team-member">
            <div class="member-avatar">💎</div>
            <div class="member-info">
                <h4 class="member-name">Savalim</h4>
                <p class="member-role">Строитель, руководитель сервера</p>
                <p class="member-description">Отвечает за постройки спавна и т.п.</p>
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
                <p class="member-description">Помогает поддерживать порядок и следит за соблюдением правил.</p>
            </div>
        </div>
    </div>
</div>

<div class="team-join">
    <h3>🌟 Хочешь присоединиться к команде?</h3>
    <p>Мы всегда ищем ответственных и активных игроков!</p>
    <a href="apply.html" class="join-team-btn">⚡ Подать заявку</a>
</div>
`;
}

// Инициализация
checkAuth();
// Принудительно сбрасываем старый контент команды (версия до редизайна)
if (localStorage.getItem('teamContentVersion') !== '2') {
    localStorage.removeItem('teamContent');
    localStorage.setItem('teamContentVersion', '2');
}
loadTeamContent();
