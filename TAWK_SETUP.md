# Настройка Tawk.to Chat

Tawk.to - это полностью бесплатный чат для сайта с поддержкой Telegram, Email и мобильного приложения.

## Шаг 1: Регистрация

1. Перейдите на https://www.tawk.to/
2. Нажмите "Sign Up Free" (зеленая кнопка)
3. Зарегистрируйтесь:
   - Введите имя
   - Email
   - Придумайте пароль
   - Нажмите "Sign Up"

## Шаг 2: Создайте Property (сайт)

1. После регистрации вас попросят создать Property
2. Введите название: **Verdant Elegy**
3. URL сайта можно указать любой (например: `verdant-elegy.vercel.app` или просто `localhost`)
4. Нажмите "Add Property"

## Шаг 3: Получите код виджета

1. После создания Property откроется страница с кодом
2. Или перейдите: Administration → Channels → Chat Widget
3. Скопируйте **Property ID** и **Widget ID** из кода

Код выглядит так:
```html
<script type="text/javascript">
var Tawk_API=Tawk_API||{}, Tawk_LoadStart=new Date();
(function(){
var s1=document.createElement("script"),s0=document.getElementsByTagName("script")[0];
s1.async=true;
s1.src='https://embed.tawk.to/65abc123def456/1hgijk789';
                                    ↑ Property ID  ↑ Widget ID
s1.charset='UTF-8';
s1.setAttribute('crossorigin','*');
s0.parentNode.insertBefore(s1,s0);
})();
</script>
```

## Шаг 4: Установите на сайт

1. Откройте файлы: `index.html`, `rules.html`, `support.html`
2. Найдите строку:
```javascript
s1.src='https://embed.tawk.to/YOUR_TAWK_ID/YOUR_WIDGET_ID';
```
3. Замените `YOUR_TAWK_ID` и `YOUR_WIDGET_ID` на ваши значения

Пример:
```javascript
s1.src='https://embed.tawk.to/65abc123def456/1hgijk789';
```

## Шаг 5: Настройте интеграции

### Telegram:
1. В панели Tawk.to: Administration → Channels → Messaging
2. Найдите Telegram и нажмите "Connect"
3. Следуйте инструкциям для подключения бота
4. Теперь сообщения с сайта будут приходить в Telegram!

### Email:
1. Administration → Settings → Email Notifications
2. Включите уведомления
3. Получайте уведомления на почту

### Мобильное приложение:
1. Скачайте Tawk.to из App Store или Google Play
2. Войдите в аккаунт
3. Отвечайте на сообщения с телефона!

## Преимущества Tawk.to:

✅ Полностью бесплатный (без ограничений!)
✅ Двусторонний чат в реальном времени
✅ Интеграция с Telegram
✅ Мобильное приложение (iOS и Android)
✅ Автоответы и боты
✅ История сообщений
✅ Мониторинг посетителей
✅ Не нужен сервер!

## Настройка внешнего вида:

1. Administration → Channels → Chat Widget
2. Вкладка "Widget Appearance"
3. Измените:
   - Цвет виджета
   - Позицию (справа/слева)
   - Текст приветствия
   - Аватар оператора

## Настройка на русский язык:

1. Administration → Channels → Chat Widget
2. Вкладка "Widget Settings"
3. Language → выберите "Russian"
4. Сохраните изменения

Готово! Теперь у вас полноценный чат без необходимости запускать сервер.

## Полезные ссылки:

- Панель управления: https://dashboard.tawk.to/
- Документация: https://help.tawk.to/
- Мобильное приложение: https://www.tawk.to/mobile-apps/
