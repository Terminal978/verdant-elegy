# Полноценный чат с Telegram

Теперь сайт имеет полноценный двусторонний чат через WebSocket и Telegram бота.

## Быстрый старт

### 1. Установка сервера

```bash
cd minecraft-site/server
npm install
```

### 2. Настройка

Создайте файл `.env`:
```
TELEGRAM_BOT_TOKEN=ваш_токен_бота
TELEGRAM_CHAT_ID=ваш_chat_id
PORT=3000
```

### 3. Запуск

```bash
npm start
```

### 4. Настройка сайта

В `script.js` измените URL сервера:
```javascript
const WS_URL = 'ws://localhost:3000'; // Локально
// const WS_URL = 'wss://your-server.com'; // Продакшен
```

## Как работает

1. **Пользователь → Вы:**
   - Пользователь пишет на сайте
   - Сообщение через WebSocket → Сервер → Telegram
   - Вы получаете уведомление в Telegram

2. **Вы → Пользователь:**
   - Вы отвечаете (Reply) на сообщение в Telegram
   - Сервер получает ответ
   - Ответ через WebSocket → Сайт
   - Пользователь видит ваш ответ в реальном времени

## Деплой на хостинг

Рекомендуемые бесплатные хостинги:
- **Railway.app** - простой деплой из GitHub
- **Render.com** - бесплатный план с WebSocket
- **Fly.io** - хороший бесплатный tier

### Пример для Railway:

1. Создайте аккаунт на railway.app
2. Подключите GitHub репозиторий
3. Укажите папку `minecraft-site/server`
4. Добавьте переменные окружения (TELEGRAM_BOT_TOKEN, TELEGRAM_CHAT_ID)
5. Деплой!

---

# Настройка чата с Telegram ботом

Чат на сайте отправляет сообщения в Telegram через бота.

## Шаг 1: Создайте Telegram бота

1. Откройте Telegram и найдите @BotFather
2. Отправьте команду `/newbot`
3. Следуйте инструкциям (придумайте имя и username)
4. Скопируйте токен бота (выглядит как: `1234567890:ABCdefGHIjklMNOpqrsTUVwxyz`)

## Шаг 2: Получите Chat ID

Вариант 1 - Личный чат:
1. Напишите боту любое сообщение
2. Откройте: `https://api.telegram.org/botYOUR_BOT_TOKEN/getUpdates`
3. Найдите `"chat":{"id":123456789}` - это ваш Chat ID

Вариант 2 - Канал/группа:
1. Добавьте бота в канал/группу как администратора
2. Отправьте сообщение в канал/группу
3. Откройте: `https://api.telegram.org/botYOUR_BOT_TOKEN/getUpdates`
4. Найдите Chat ID (для каналов начинается с `-100`)

## Шаг 3: Настройте код

В файле `script.js` найдите и замените:

```javascript
const TELEGRAM_BOT_TOKEN = 'YOUR_BOT_TOKEN';
const TELEGRAM_CHAT_ID = 'YOUR_CHAT_ID';
```

На ваши данные:

```javascript
const TELEGRAM_BOT_TOKEN = '1234567890:ABCdefGHIjklMNOpqrsTUVwxyz';
const TELEGRAM_CHAT_ID = '123456789';
```

## Как это работает:

1. Пользователь пишет сообщение в чате на сайте
2. Сообщение отправляется в Telegram через Bot API
3. Вы получаете уведомление в Telegram
4. Отвечаете пользователю через Telegram, Discord или форму поддержки

## Примечание:

Это одностороннее решение (сайт → Telegram). Для двусторонней связи нужен сервер с WebSocket.

---

# Настройка Telegram чата

## Вариант 1: Telegram виджет комментариев (рекомендуется)

1. Создайте публичный Telegram канал
2. Опубликуйте пост в канале
3. Получите username канала и ID поста
4. В файлах замените:
   - `YOUR_CHANNEL_USERNAME` на username канала (без @)
   - `YOUR_POST_ID` на ID поста

Пример:
```html
data-telegram-discussion="mychannel/123"
```

## Вариант 2: Прямая ссылка на бота

1. Создайте Telegram бота через @BotFather
2. Получите username бота
3. Замените `YOUR_BOT_USERNAME` на username бота

Пример:
```html
<a href="https://t.me/mybot" target="_blank"
```

## Вариант 3: Полноценный чат с сервером (продвинутый)

Для двустороннего чата нужен сервер:

1. Создайте Node.js сервер
2. Настройте Telegram Bot API
3. Используйте WebSocket для связи сайт-сервер
4. Бот пересылает сообщения между сайтом и Telegram

Пример структуры:
```
Пользователь сайта → WebSocket → Сервер → Telegram Bot → Вы
Вы → Telegram → Bot → Сервер → WebSocket → Пользователь сайта
```

Если нужна помощь с настройкой сервера, дайте знать!

---

# Настройка плавающей кнопки чата

На всех страницах сайта есть плавающая кнопка чата в правом нижнем углу.

## Настройка Telegram

1. Создайте Telegram бот или используйте свой личный аккаунт
2. Получите ваш username (например: @yourname или @yourbotname)
3. В файлах `index.html`, `rules.html`, `support.html` найдите:
```html
<a href="https://t.me/YOUR_TELEGRAM_USERNAME" target="_blank"
```
4. Замените `YOUR_TELEGRAM_USERNAME` на ваш username:
```html
<a href="https://t.me/yourname" target="_blank"
```

## Настройка Discord

В тех же файлах найдите:
```html
<a href="https://discord.gg/YOUR_INVITE_CODE" target="_blank"
```
Замените `YOUR_INVITE_CODE` на ваш код приглашения Discord.

После настройки пользователи смогут:
- Нажать на кнопку чата в углу экрана
- Выбрать Telegram или Discord
- Написать вам напрямую

---

# Настройка Discord виджета для чата

Чтобы настроить встроенный Discord виджет на странице chat.html:

## Шаг 1: Включите виджет на вашем Discord сервере

1. Откройте настройки вашего Discord сервера
2. Перейдите в "Виджет сервера" (Server Widget)
3. Включите виджет сервера
4. Выберите канал приглашения (можно любой публичный канал)

## Шаг 2: Получите ID вашего Discord сервера

1. Откройте Discord в браузере или приложении
2. Включите режим разработчика: Настройки → Расширенные → Режим разработчика
3. Правой кнопкой на ваш сервер → Копировать ID сервера
4. Сохраните этот ID

## Шаг 3: Создайте постоянное приглашение

1. Правой кнопкой на канал → Пригласить людей
2. Нажмите "Изменить ссылку приглашения"
3. Установите "Срок действия: Никогда"
4. Скопируйте код приглашения (например: abc123xyz)

## Шаг 4: Настройте виджет в коде

1. Откройте файл `chat.html`
2. Найдите строку:
```html
<iframe src="https://discord.com/widget?id=YOUR_SERVER_ID&theme=dark"
```
3. Замените `YOUR_SERVER_ID` на ID вашего сервера

4. Найдите строку:
```html
<a href="https://discord.gg/YOUR_INVITE_CODE" target="_blank"
```
5. Замените `YOUR_INVITE_CODE` на ваш код приглашения

## Пример:
```html
<iframe src="https://discord.com/widget?id=1234567890123456789&theme=dark"

<a href="https://discord.gg/abc123xyz" target="_blank"
```

После настройки виджет будет показывать:
- Количество участников онлайн
- Список участников
- Кнопку для присоединения к серверу

---

# Настройка Discord Webhook

Чтобы получать запросы поддержки в Discord:

1. Откройте настройки вашего Discord сервера
2. Перейдите в нужный канал → Настройки канала → Интеграции
3. Создайте новый Webhook
4. Скопируйте URL webhook
5. Откройте файл `script.js`
6. Найдите строку: `const webhookURL = 'YOUR_DISCORD_WEBHOOK_URL_HERE';`
7. Замените `YOUR_DISCORD_WEBHOOK_URL_HERE` на ваш webhook URL

Пример:
```javascript
const webhookURL = 'https://discord.com/api/webhooks/1234567890/abcdefghijklmnop';
```

После этого все запросы из формы поддержки будут автоматически отправляться в указанный Discord канал.

## Настройка ссылки на Discord сервер

Чтобы добавить ссылку на ваш Discord сервер:

1. Создайте приглашение на ваш Discord сервер (бессрочное)
2. Откройте файл `support.html`
3. Найдите строку: `<a href="https://discord.gg/YOUR_INVITE_CODE" target="_blank" class="discord-btn">`
4. Замените `YOUR_INVITE_CODE` на ваш код приглашения

Пример:
```html
<a href="https://discord.gg/abc123xyz" target="_blank" class="discord-btn">
```

