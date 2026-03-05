# Настройка EmailJS для проверки email

## Шаг 1: Регистрация на EmailJS

1. Перейдите на https://www.emailjs.com/
2. Нажмите "Sign Up" (Регистрация)
3. Зарегистрируйтесь через Google или email

## Шаг 2: Подключите email сервис

1. После входа перейдите в раздел "Email Services"
2. Нажмите "Add New Service"
3. Выберите ваш email провайдер:
   - **Gmail** (рекомендуется)
   - Outlook
   - Yahoo
   - Или другой
4. Следуйте инструкциям для подключения
5. Скопируйте **service_lhte55r** (например: `service_abc123`)

## Шаг 3: Создайте Email Template

1. Перейдите в раздел "Email Templates"
2. Нажмите "Create New Template"
3. Настройте шаблон:

**Subject (Тема):**
```
Код подтверждения для Verdant Elegy
```

**Content (Содержимое):**
```
Привет, {{to_name}}!

Ваш код подтверждения для регистрации на сервере {{site_name}}:

{{verification_code}}

Введите этот код на сайте для завершения регистрации.

Если вы не регистрировались на нашем сервере, просто проигнорируйте это письмо.

С уважением,
Команда Verdant Elegy
```

4. Сохраните шаблон
5. Скопируйте **template_4p7zvrq** (например: `template_xyz789`)

## Шаг 4: Получите Public Key

1. Перейдите в раздел "Account" → "General"
2. Найдите **vfjF70YDhEMPBOrrY** (например: `AbCdEfGhIjKlMnOp`)
3. Скопируйте его

## Шаг 5: Обновите код на сайте

Откройте файл `auth.js` и замените:

```javascript
const EMAILJS_PUBLIC_KEY = 'YOUR_PUBLIC_KEY'; // Вставьте ваш Public Key
const EMAILJS_SERVICE_ID = 'YOUR_SERVICE_ID'; // Вставьте ваш Service ID
const EMAILJS_TEMPLATE_ID = 'YOUR_TEMPLATE_ID'; // Вставьте ваш Template ID
```

Например:
```javascript
const EMAILJS_PUBLIC_KEY = 'AbCdEfGhIjKlMnOp';
const EMAILJS_SERVICE_ID = 'service_abc123';
const EMAILJS_TEMPLATE_ID = 'template_xyz789';
```

## Шаг 6: Тестирование

1. Откройте страницу регистрации
2. Введите имя пользователя и email
3. Нажмите "📧 Отправить код"
4. Проверьте почту (может попасть в спам!)
5. Введите полученный код
6. Завершите регистрацию

## Лимиты бесплатного плана

- 200 писем в месяц
- Этого достаточно для небольшого сервера

## Если письма не приходят

1. Проверьте папку "Спам"
2. Убедитесь, что Service подключен правильно
3. Проверьте Template ID и Service ID
4. Посмотрите логи в консоли браузера (F12)

## Альтернатива (если EmailJS не работает)

Можно временно отключить проверку email:
1. Закомментируйте проверку кода в `auth.js`
2. Или используйте фиктивный код "123456" для тестирования
