
// Проверяем статус набора
function checkApplicationStatus() {
    const status = localStorage.getItem('applicationsOpen') !== 'false';
    const statusBadge = document.querySelector('.status-badge');
    const formContainer = document.getElementById('apply-form-container');
    const closedMessage = document.getElementById('apply-closed');
    
    if (status) {
        statusBadge.className = 'status-badge open';
        statusBadge.innerHTML = '🟢 Набор открыт';
        formContainer.style.display = 'block';
        closedMessage.style.display = 'none';
    } else {
        statusBadge.className = 'status-badge closed';
        statusBadge.innerHTML = '🔴 Набор закрыт';
        formContainer.style.display = 'none';
        closedMessage.style.display = 'block';
    }
}

// Обработка формы заявки
document.getElementById('applyForm').addEventListener('submit', async function(e) {
    e.preventDefault();
    
    // Проверяем, открыт ли набор
    const status = localStorage.getItem('applicationsOpen') !== 'false';
    if (!status) {
        alert('❌ Набор закрыт!');
        return;
    }
    
    const application = {
        id: Date.now().toString(),
        minecraftNick: document.getElementById('minecraft-nick').value.trim(),
        age: document.getElementById('age').value,
        discord: document.getElementById('discord').value.trim(),
        playTime: document.getElementById('play-time').value.trim(),
        dailyHours: document.getElementById('daily-hours').value.trim(),
        adminExperience: document.getElementById('admin-experience').value.trim(),
        motivation: document.getElementById('motivation').value.trim(),
        conflictSituation: document.getElementById('conflict-situation').value.trim(),
        additionalInfo: document.getElementById('additional-info').value.trim(),
        timestamp: new Date().toISOString(),
        status: 'pending' // pending, approved, rejected
    };
    
    // Сохраняем заявку
    const applications = JSON.parse(localStorage.getItem('adminApplications') || '[]');
    applications.push(application);
    localStorage.setItem('adminApplications', JSON.stringify(applications));
    
    // Отправляем в Discord
    const discordSent = await sendToDiscord(application);
    
    if (discordSent) {
        alert('✅ Ваша заявка успешно отправлена! Ожидайте ответа в Discord.');
    } else {
        alert('✅ Ваша заявка сохранена! Администраторы увидят её в панели управления.');
    }
    
    this.reset();
});
// Отправка в Discord webhook
async function sendToDiscord(app) {
    const webhookURL = 'https://discord.com/api/webhooks/1479051147984634018/hgJWOlti7YxGbXvHwg9-p0vg4HA64ir1txqg84BUUL97zG1fjZOUjxNghkmkoLiKZS5c';
    
    const embed = {
        username: 'Verdant Elegy',
        avatar_url: 'https://i.imgur.com/AfFp7pu.png', // Замените на URL вашей аватарки
        embeds: [{
            title: '⚡ Новая заявка на администратора',
            color: 15844367, // Золотой цвет
            fields: [
                { name: '👤 Minecraft ник', value: app.minecraftNick, inline: true },
                { name: '🎂 Возраст', value: app.age.toString(), inline: true },
                { name: '💬 Discord', value: app.discord, inline: true },
                { name: '⏱️ Время на сервере', value: app.playTime, inline: true },
                { name: '📅 Активность в день', value: app.dailyHours, inline: true },
                { name: '\u200B', value: '\u200B', inline: true }, // Пустое поле для выравнивания
                { name: '🎓 Опыт администрирования', value: app.adminExperience.substring(0, 1024), inline: false },
                { name: '💡 Мотивация', value: app.motivation.substring(0, 1024), inline: false },
                { name: '⚖️ Конфликтная ситуация', value: app.conflictSituation.substring(0, 1024), inline: false }
            ],
            timestamp: new Date().toISOString(),
            footer: { text: 'Verdant Elegy Applications' }
        }]
    };
    
    if (app.additionalInfo) {
        embed.embeds[0].fields.push({
            name: '📝 Дополнительно',
            value: app.additionalInfo.substring(0, 1024),
            inline: false
        });
    }
    
    try {
        const response = await fetch(webhookURL, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify(embed)
        });
        
        if (response.ok) {
            console.log('✅ Заявка отправлена в Discord');
            return true;
        } else {
            console.error('❌ Ошибка отправки в Discord:', response.status);
            return false;
        }
    } catch (error) {
        console.error('❌ Ошибка отправки в Discord:', error);
        return false;
    }
}

// Инициализация
checkApplicationStatus();
