// Панель администратора

// Проверка доступа
const currentUser = JSON.parse(localStorage.getItem('currentUser'));

if (!currentUser || (currentUser.role !== 'admin' && currentUser.role !== 'owner')) {
    alert('❌ Доступ запрещен! Только для администраторов.');
    window.location.href = 'login.html';
}

const isOwner = currentUser.role === 'owner';

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
    const owners = users.filter(u => u.role === 'owner').length;
    const regular = users.filter(u => u.role === 'user').length;
    
    document.getElementById('total-users').textContent = users.length;
    document.getElementById('total-admins').textContent = admins + owners;
    document.getElementById('total-regular').textContent = regular;
}

// Загрузка списка пользователей
function loadUsers() {
    const users = JSON.parse(localStorage.getItem('users') || '[]');
    const tbody = document.getElementById('users-list');
    
    console.log('📊 Загружено пользователей:', users.length);
    console.log('👥 Список пользователей:', users);
    
    tbody.innerHTML = '';
    
    if (users.length === 0) {
        tbody.innerHTML = '<tr><td colspan="5" style="text-align: center; padding: 20px; color: #999;">Нет зарегистрированных пользователей</td></tr>';
        return;
    }
    
    users.forEach((user, index) => {
        const tr = document.createElement('tr');
        
        // Создатель может редактировать всех, админ - только обычных пользователей
        const canEdit = isOwner || (currentUser.role === 'admin' && user.role === 'user');
        const canDelete = isOwner;
        
        tr.innerHTML = `
            <td data-label="Имя пользователя:">${user.username}</td>
            <td data-label="Email:">${user.email}</td>
            <td data-label="Minecraft ник:">${user.minecraft}</td>
            <td data-label="Роль:">
                ${canEdit ? `
                    <select class="role-select" data-index="${index}">
                        <option value="user" ${user.role === 'user' ? 'selected' : ''}>Пользователь</option>
                        <option value="admin" ${user.role === 'admin' ? 'selected' : ''}>Администратор</option>
                        ${isOwner ? `<option value="owner" ${user.role === 'owner' ? 'selected' : ''}>Создатель</option>` : ''}
                    </select>
                ` : `
                    <span class="role-badge role-${user.role}">
                        ${user.role === 'owner' ? '👑 Создатель' : user.role === 'admin' ? '⚙️ Администратор' : '👤 Пользователь'}
                    </span>
                `}
            </td>
            <td data-label="Действия:">
                ${canDelete ? `
                    <button class="delete-user-btn" data-index="${index}">🗑️ Удалить</button>
                ` : `
                    <span style="color: #999; font-size: 12px;">Нет прав</span>
                `}
            </td>
        `;
        tbody.appendChild(tr);
    });
    
    // Обработчики для изменения роли
    document.querySelectorAll('.role-select').forEach(select => {
        select.addEventListener('change', (e) => {
            const index = parseInt(e.target.dataset.index);
            const users = JSON.parse(localStorage.getItem('users') || '[]');
            const newRole = e.target.value;
            
            // Проверка прав
            if (!isOwner && newRole !== 'user') {
                alert('❌ У вас нет прав для назначения этой роли!');
                e.target.value = users[index].role;
                return;
            }
            
            users[index].role = newRole;
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
    if (!isOwner) {
        alert('❌ Только создатель может выполнить это действие!');
        return;
    }
    
    if (confirm('⚠️ Удалить всех обычных пользователей? Администраторы останутся.')) {
        const users = JSON.parse(localStorage.getItem('users') || '[]');
        const adminsOnly = users.filter(u => u.role === 'admin' || u.role === 'owner');
        localStorage.setItem('users', JSON.stringify(adminsOnly));
        loadUsers();
        loadStats();
        alert('✅ Обычные пользователи удалены');
    }
});

// Кнопка "Заявки на администратора"
document.getElementById('check-applications-btn').addEventListener('click', () => {
    if (!isOwner) {
        alert('❌ Только создатель может просматривать заявки!');
        return;
    }
    window.location.href = 'applications.html';
});

// Кнопка "Проверить запросы"
document.getElementById('check-support-btn').addEventListener('click', () => {
    window.location.href = 'requests.html';
});

// Кнопка "Редактировать правила"
document.getElementById('edit-rules-btn').addEventListener('click', () => {
    if (!isOwner) {
        alert('❌ Только создатель может редактировать правила!');
        return;
    }
    
    // Загружаем текущие правила
    const currentRules = localStorage.getItem('serverRules') || getDefaultRulesContent();
    rulesEditorTextarea.value = currentRules;
    
    // Показываем редактор
    rulesEditor.style.display = 'block';
    rulesEditor.scrollIntoView({ behavior: 'smooth' });
});

// Редактор правил
const rulesEditor = document.getElementById('rules-editor');
const rulesEditorTextarea = document.getElementById('rules-editor-textarea');
const rulesPreview = document.getElementById('rules-preview');
const rulesPreviewContent = document.getElementById('rules-preview-content');

// Кнопка "Сохранить правила"
document.getElementById('save-rules-btn').addEventListener('click', () => {
    const content = rulesEditorTextarea.value.trim();
    
    if (!content) {
        alert('❌ Содержимое не может быть пустым!');
        return;
    }
    
    // Сохраняем в localStorage
    localStorage.setItem('serverRules', content);
    
    alert('✅ Правила сервера успешно обновлены!');
    rulesEditor.style.display = 'none';
    rulesPreview.style.display = 'none';
});

// Кнопка "Предпросмотр правил"
document.getElementById('preview-rules-btn').addEventListener('click', () => {
    const content = rulesEditorTextarea.value.trim();
    
    if (!content) {
        alert('❌ Нечего предпросматривать!');
        return;
    }
    
    rulesPreviewContent.innerHTML = content;
    rulesPreview.style.display = 'block';
});

// Кнопка "Отмена правил"
document.getElementById('cancel-rules-btn').addEventListener('click', () => {
    if (confirm('Отменить изменения?')) {
        rulesEditor.style.display = 'none';
        rulesPreview.style.display = 'none';
    }
});

// Получить правила по умолчанию
function getDefaultRulesContent() {
    // Возвращаем текущее содержимое из rules.html
    return `<div class="rule-category">
    <h3>1. Общение</h3>
    <div class="rule-item">
        <span class="rule-number">1.1</span>
        <div class="rule-content">
            <p>Использование, хранение, наличие активных / замороженных подписок на читы и прочее ПО, которое предоставляет преимущество над другими пользователями сервера менее чем 14 дней назад включительно. Если запрещенное ПО не было удалено, дата последнего использования не имеет значения, за исключением остальных файлов.</p>
        </div>
    </div>
    <div class="rule-item">
        <span class="rule-number">1.2</span>
        <div class="rule-content">
            <p>Осуществление обхода банов, мутов любыми средствами запрещено -бан / мут на аккаунт с предыдущей блокировкой и на тот, с помощью которого осуществлялся обход блокировки, сроком, превышающим в два раза предыдущую блокировку.</p>
            <p><em>При попытке обойти бан за использование / хранение читов или мут / гаг в третий раз — бан на 60 дней на все аккаунты игрока.</em></p>
        </div>
    </div>
    <div class="rule-item">
        <span class="rule-number">1.3</span>
        <div class="rule-content">
            <p>Использование любых багов на сервере для получения преимущества над другими игроками, а также багов, мешающих работе сервера - бан на 1-2 часа (без предупреждения)</p>
        </div>
    </div>
</div>

<div class="rule-category">
    <h3>2. Общение</h3>
    <div class="rule-item">
        <span class="rule-number">2.1</span>
        <div class="rule-content">
            <p>Оскорбление родных, а также любое их упоминание в негативном ключе - мут на 8 часов (без предупреждения)</p>
        </div>
    </div>
    <div class="rule-item">
        <span class="rule-number">2.2</span>
        <div class="rule-content">
            <p>Буллинг и угрозы в адрес конкретного игрока в голосовом либо текстовом чате сервера - мут от 1-3 часов (после предупреждения)</p>
        </div>
    </div>
    <div class="rule-item">
        <span class="rule-number">2.3</span>
        <div class="rule-content">
            <p>Конфликты на почве политики, религии, расы, ориентации- мут на 3 часа (без предупреждения)</p>
        </div>
    </div>
    <div class="rule-item">
        <span class="rule-number">2.4</span>
        <div class="rule-content">
            <p>Пропаганда нацизма, терроризма, проповедование их идей, использование их символики -бан на 5 дней (без предупреждение)</p>
        </div>
    </div>
    <div class="rule-item">
        <span class="rule-number">2.5</span>
        <div class="rule-content">
            <p>Негрубое оскорбление проекта или администрации либо проявление неуважения - мут на 8 часов (без предупреждения)</p>
        </div>
    </div>
    <div class="rule-item">
        <span class="rule-number">2.6</span>
        <div class="rule-content">
            <p>Грубое оскорбление проекта или администрации - бан на 1 день (без предупреждения)</p>
        </div>
    </div>
    <div class="rule-item">
        <span class="rule-number">2.7</span>
        <div class="rule-content">
            <p>Спам (от 5 сообщений за короткое время)- мут на 1 час (без предупреждения)</p>
        </div>
    </div>
</div>

<div class="rule-category">
    <h3>3. Ники</h3>
    <div class="rule-item">
        <span class="rule-number">3.1</span>
        <div class="rule-content">
            <p>Запрещено ставить никнеймы с использованием невидимых либо трудночитаемых символов - бан на 1 час (после предупреждения)</p>
        </div>
    </div>
    <div class="rule-item">
        <span class="rule-number">3.2</span>
        <div class="rule-content">
            <p>Реклама запрещенного ПО через никнейм- бан на 3 дня ( без предупреждения)</p>
        </div>
    </div>
</div>

<div class="rule-category">
    <h3>4. Прочее</h3>
    <div class="rule-item">
        <span class="rule-number">4.1</span>
        <div class="rule-content">
            <p>Игрок может быть занесен в черный список проекта (ЧСП) за особо серьезные нарушения, направленные против проекта, его администрации или игроков.</p>
        </div>
    </div>
    <div class="rule-item">
        <span class="rule-number">4.2</span>
        <div class="rule-content">
            <p>Обман или намеренный ввод администрации в заблуждение в любой форме - бан на 1 час ( без предупреждения)</p>
        </div>
    </div>
</div>

<div class="rule-category">
    <h3>⚖️ Основания для занесения в ЧСП:</h3>
    <div class="punishment-info">
        <div class="punishment-item">
            <span class="punishment-icon">⚠️</span>
            <div>
                <strong>Явное неуважение / грубое оскорбление руководства и идеологии проекта</strong>
            </div>
        </div>
        <div class="punishment-item">
            <span class="punishment-icon">⚠️</span>
            <div>
                <strong>Оскорбления родных руководства проекта</strong>
            </div>
        </div>
        <div class="punishment-item">
            <span class="punishment-icon">⚠️</span>
            <div>
                <strong>Нанесение ущерба проекту и его репутации</strong>
            </div>
        </div>
        <div class="punishment-item">
            <span class="punishment-icon">⚠️</span>
            <div>
                <strong>Серьезный слив личной информации</strong>
            </div>
        </div>
        <div class="punishment-item">
            <span class="punishment-icon">⚠️</span>
            <div>
                <strong>Скам / нанесение ущерба игрокам</strong>
            </div>
        </div>
        <div class="punishment-item">
            <span class="punishment-icon">⚠️</span>
            <div>
                <strong>По решению руководства проекта</strong>
            </div>
        </div>
        <div class="punishment-item">
            <span class="punishment-icon">🔴</span>
            <div>
                <strong>Наказание: бан навсегда.</strong>
            </div>
        </div>
    </div>
</div>`;
}

// Функции форматирования текста
function formatText(format) {
    const textarea = document.getElementById('rules-editor-textarea');
    const start = textarea.selectionStart;
    const end = textarea.selectionEnd;
    const selectedText = textarea.value.substring(start, end);
    
    if (!selectedText) {
        alert('Выделите текст для форматирования');
        return;
    }
    
    let formattedText = '';
    switch(format) {
        case 'bold':
            formattedText = `<strong>${selectedText}</strong>`;
            break;
        case 'italic':
            formattedText = `<em>${selectedText}</em>`;
            break;
        case 'underline':
            formattedText = `<u>${selectedText}</u>`;
            break;
    }
    
    textarea.value = textarea.value.substring(0, start) + formattedText + textarea.value.substring(end);
    textarea.focus();
    textarea.setSelectionRange(start, start + formattedText.length);
}

function insertHeading() {
    const textarea = document.getElementById('rules-editor-textarea');
    const text = prompt('Введите текст заголовка:');
    if (text) {
        insertAtCursor(textarea, `<h3>${text}</h3>\n`);
    }
}

function insertRule() {
    const textarea = document.getElementById('rules-editor-textarea');
    const number = prompt('Номер правила (например, 1.1):');
    const text = prompt('Текст правила:');
    if (number && text) {
        const rule = `<div class="rule-item">
    <span class="rule-number">${number}</span>
    <div class="rule-content">
        <p>${text}</p>
    </div>
</div>\n`;
        insertAtCursor(textarea, rule);
    }
}

function insertCategory() {
    const textarea = document.getElementById('rules-editor-textarea');
    const title = prompt('Название категории:');
    if (title) {
        const category = `<div class="rule-category">
    <h3>${title}</h3>
    <!-- Добавьте правила здесь -->
</div>\n`;
        insertAtCursor(textarea, category);
    }
}

function insertDivider() {
    const textarea = document.getElementById('rules-editor-textarea');
    insertAtCursor(textarea, '\n<hr>\n');
}

function insertBreak() {
    const textarea = document.getElementById('rules-editor-textarea');
    insertAtCursor(textarea, '<br>\n');
}

function insertAtCursor(textarea, text) {
    const start = textarea.selectionStart;
    const end = textarea.selectionEnd;
    textarea.value = textarea.value.substring(0, start) + text + textarea.value.substring(end);
    textarea.focus();
    textarea.setSelectionRange(start + text.length, start + text.length);
}

// Редактор страницы "О нас"
const aboutEditor = document.getElementById('about-editor');
const aboutEditorTextarea = document.getElementById('about-editor-textarea');
const aboutPreview = document.getElementById('about-preview');
const aboutPreviewContent = document.getElementById('about-preview-content');

// Кнопка "Редактировать О нас"
document.getElementById('edit-about-btn').addEventListener('click', () => {
    if (!isOwner) {
        alert('❌ Только создатель может редактировать страницу "О нас"!');
        return;
    }
    
    // Загружаем текущее содержимое
    const currentContent = localStorage.getItem('aboutContent') || getDefaultAboutContent();
    aboutEditorTextarea.value = currentContent;
    
    // Показываем редактор
    aboutEditor.style.display = 'block';
    aboutEditor.scrollIntoView({ behavior: 'smooth' });
});

// Кнопка "Сохранить"
document.getElementById('save-about-btn').addEventListener('click', () => {
    const content = aboutEditorTextarea.value.trim();
    
    if (!content) {
        alert('❌ Содержимое не может быть пустым!');
        return;
    }
    
    // Сохраняем в localStorage
    localStorage.setItem('aboutContent', content);
    
    alert('✅ Страница "О нас" успешно обновлена!');
    aboutEditor.style.display = 'none';
    aboutPreview.style.display = 'none';
});

// Кнопка "Предпросмотр"
document.getElementById('preview-about-btn').addEventListener('click', () => {
    const content = aboutEditorTextarea.value.trim();
    
    if (!content) {
        alert('❌ Нечего предпросматривать!');
        return;
    }
    
    aboutPreviewContent.innerHTML = content;
    aboutPreview.style.display = 'block';
});

// Кнопка "Отмена"
document.getElementById('cancel-about-btn').addEventListener('click', () => {
    if (confirm('Отменить изменения?')) {
        aboutEditor.style.display = 'none';
        aboutPreview.style.display = 'none';
    }
});

// Получить содержимое по умолчанию
function getDefaultAboutContent() {
    return `<div class="about-block">
    <h3>🎮 Наш сервер</h3>
    <p>Verdant Elegy - это уютный Minecraft сервер, где каждый игрок может найти что-то для себя. Мы создали дружелюбное сообщество, где ценятся взаимопомощь и креативность.</p>
</div>

<div class="about-block">
    <h3>🌟 Наша миссия</h3>
    <p>Мы стремимся создать лучший игровой опыт для всех наших игроков. Наша цель - построить сообщество, где каждый чувствует себя как дома.</p>
</div>

<div class="about-block">
    <h3>👥 Команда</h3>
    <p>Наша команда администраторов работает круглосуточно, чтобы обеспечить комфортную игру. Мы всегда готовы помочь и ответить на ваши вопросы.</p>
</div>

<div class="about-block">
    <h3>🎯 Особенности</h3>
    <ul>
        <li>Стабильная работа сервера 24/7</li>
        <li>Дружелюбное сообщество</li>
        <li>Регулярные обновления и события</li>
        <li>Защита от гриферов</li>
        <li>Активная администрация</li>
    </ul>
</div>`;
}

// Инициализация
loadStats();
loadUsers();
checkServerStatus();

// Кнопка обновления списка пользователей
document.getElementById('refresh-users-btn').addEventListener('click', () => {
    const btn = document.getElementById('refresh-users-btn');
    btn.style.pointerEvents = 'none'; // Блокируем повторные клики
    
    loadStats();
    loadUsers();
    
    // Возвращаем возможность клика через 1 секунду
    setTimeout(() => {
        btn.style.pointerEvents = 'auto';
    }, 1000);
});

// Автоматическое обновление каждые 5 секунд
setInterval(() => {
    loadStats();
    loadUsers();
}, 5000);
