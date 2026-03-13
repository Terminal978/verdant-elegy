# 📚 Примеры оформления команды

## Пример 1: Простая структура

```html
<div class="team-intro">
    <p>Наша дружная команда всегда готова помочь!</p>
</div>

<div class="team-category">
    <h3>👑 Руководство</h3>
    <div class="team-grid">
        <div class="team-member">
            <div class="member-avatar">👑</div>
            <div class="member-info">
                <h4 class="member-name">Steve</h4>
                <p class="member-role">Создатель сервера</p>
                <p class="member-description">Основатель проекта, отвечает за развитие сервера.</p>
            </div>
        </div>
    </div>
</div>
```

## Пример 2: Несколько членов в категории

```html
<div class="team-category">
    <h3>⚙️ Администраторы</h3>
    <div class="team-grid">
        <div class="team-member">
            <div class="member-avatar">⚙️</div>
            <div class="member-info">
                <h4 class="member-name">Alex</h4>
                <p class="member-role">Главный администратор</p>
                <p class="member-description">Следит за порядком и помогает игрокам.</p>
            </div>
        </div>
        
        <div class="team-member">
            <div class="member-avatar">⚙️</div>
            <div class="member-info">
                <h4 class="member-name">Herobrine</h4>
                <p class="member-role">Технический администратор</p>
                <p class="member-description">Отвечает за техническую часть сервера.</p>
            </div>
        </div>
    </div>
</div>
```

## Пример 3: Полная структура с правильной иерархией

```html
<div class="team-intro">
    <p>Verdant Elegy - это не просто сервер, это семья! Познакомьтесь с нашей командой.</p>
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
```

## Пример 4: С дополнительным форматированием

```html
<div class="team-member">
    <div class="member-avatar">🎮</div>
    <div class="member-info">
        <h4 class="member-name">Notch</h4>
        <p class="member-role">Игровой мастер</p>
        <p class="member-description">
            Организует <strong>ивенты</strong> и <em>мероприятия</em> на сервере.<br>
            Онлайн: <strong>ежедневно с 18:00 до 23:00</strong>
        </p>
    </div>
</div>
```

## Советы по оформлению

1. **Используйте понятные эмодзи** - они помогают быстро определить роль
2. **Краткие описания** - 1-2 предложения достаточно
3. **Единый стиль** - одинаковое оформление для всех карточек
4. **Группировка** - объединяйте похожие роли в категории
5. **Актуальность** - регулярно обновляйте информацию

## Популярные эмодзи

- 👑 Создатель
- 🏆 Главный администратор
- 🛠️ Модератор
- ⚙️ Администратор
- 🎮 Игровой мастер
- 💻 Разработчик
- 🎨 Дизайнер
- 📝 Редактор
- 🎭 Ивент-мейкер
- 💬 Саппорт

## Правильная иерархия ролей

**От высшей к низшей:**
1. 👑 Создатель / Владелец
2. 🏆 Главный администратор
3. 🛠️ Модератор
4. ⚙️ Администратор

**Важно:** Модераторы стоят выше обычных администраторов, но ниже главного администратора!
