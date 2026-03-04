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

