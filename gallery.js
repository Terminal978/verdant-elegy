// Галерея изображений
let galleryImages = [];
let currentImageIndex = 0;
let currentSlideIndex = 0;
let editingIndex = -1;
let currentUrlCount = 1;

console.log('Gallery.js loaded');

// Загрузка галереи из localStorage
function loadGallery() {
    const saved = localStorage.getItem('galleryImages');
    if (saved) {
        galleryImages = JSON.parse(saved);
    }
    renderGallery();
}

// Сохранение галереи в localStorage
function saveGallery() {
    localStorage.setItem('galleryImages', JSON.stringify(galleryImages));
}

// Отображение галереи
function renderGallery() {
    const grid = document.getElementById('gallery-grid');
    const emptyGallery = document.getElementById('empty-gallery');
    
    if (galleryImages.length === 0) {
        grid.style.display = 'none';
        emptyGallery.style.display = 'block';
        return;
    }
    
    grid.style.display = 'grid';
    emptyGallery.style.display = 'none';
    grid.innerHTML = '';
    
    galleryImages.forEach((item, index) => {
        const card = document.createElement('div');
        card.className = 'gallery-card';
        card.onclick = () => openModal(index);
        
        const firstImage = Array.isArray(item.imageUrl) ? item.imageUrl[0] : item.imageUrl;
        
        card.innerHTML = `
            <img src="${firstImage}" alt="${item.title}" loading="lazy">
            <div class="gallery-card-info">
                <h3>${item.title}</h3>
                ${item.description ? `<p>${item.description}</p>` : ''}
                <small>Автор: ${item.author} • ${new Date(item.date).toLocaleDateString('ru-RU')}</small>
                ${Array.isArray(item.imageUrl) && item.imageUrl.length > 1 ? 
                    `<span class="image-count-badge">${item.imageUrl.length} фото</span>` : ''}
            </div>
        `;
        
        grid.appendChild(card);
    });
}


// Открытие модального окна
function openModal(index) {
    currentImageIndex = index;
    currentSlideIndex = 0;
    const item = galleryImages[index];
    const modal = document.getElementById('gallery-modal');
    
    updateModalContent();
    modal.style.display = 'flex';
    
    const currentUser = localStorage.getItem('currentUser');
    const modalActions = document.getElementById('modal-actions');
    
    if (currentUser) {
        const userData = JSON.parse(currentUser);
        if (userData.username === item.author || userData.role === 'admin') {
            modalActions.style.display = 'flex';
        } else {
            modalActions.style.display = 'none';
        }
    } else {
        modalActions.style.display = 'none';
    }
}

// Обновление содержимого модального окна
function updateModalContent() {
    const item = galleryImages[currentImageIndex];
    const images = Array.isArray(item.imageUrl) ? item.imageUrl : [item.imageUrl];
    
    document.getElementById('modal-image').src = images[currentSlideIndex];
    document.getElementById('modal-title').textContent = item.title;
    document.getElementById('modal-description').textContent = item.description || '';
    document.getElementById('modal-author').textContent = `Автор: ${item.author}`;
    document.getElementById('modal-date').textContent = new Date(item.date).toLocaleDateString('ru-RU');
    
    const prevBtn = document.getElementById('prev-btn');
    const nextBtn = document.getElementById('next-btn');
    
    if (images.length > 1) {
        prevBtn.style.display = 'block';
        nextBtn.style.display = 'block';
    } else {
        prevBtn.style.display = 'none';
        nextBtn.style.display = 'none';
    }
    
    const indicators = document.getElementById('slider-indicators');
    indicators.innerHTML = '';
    
    if (images.length > 1) {
        images.forEach((_, i) => {
            const dot = document.createElement('span');
            dot.className = 'slider-dot' + (i === currentSlideIndex ? ' active' : '');
            dot.onclick = () => {
                currentSlideIndex = i;
                updateModalContent();
            };
            indicators.appendChild(dot);
        });
    }
}

// Закрытие модального окна
function closeModal() {
    document.getElementById('gallery-modal').style.display = 'none';
}

// Переключение слайдов
function changeSlide(direction) {
    const item = galleryImages[currentImageIndex];
    const images = Array.isArray(item.imageUrl) ? item.imageUrl : [item.imageUrl];
    
    currentSlideIndex += direction;
    
    if (currentSlideIndex < 0) {
        currentSlideIndex = images.length - 1;
    } else if (currentSlideIndex >= images.length) {
        currentSlideIndex = 0;
    }
    
    updateModalContent();
}


// Показать форму добавления
function showGalleryEditor(index = -1) {
    console.log('showGalleryEditor called with index:', index);
    const editor = document.getElementById('gallery-editor');
    const form = document.getElementById('gallery-form');
    const title = document.getElementById('editor-title');
    const submitBtn = document.getElementById('submit-btn');
    
    editingIndex = index;
    
    if (index >= 0) {
        const item = galleryImages[index];
        title.textContent = 'Редактировать изображение';
        submitBtn.textContent = '💾 Сохранить';
        
        document.getElementById('image-title').value = item.title;
        document.getElementById('image-description').value = item.description || '';
        
        const images = Array.isArray(item.imageUrl) ? item.imageUrl : [item.imageUrl];
        currentUrlCount = images.length;
        
        images.forEach((url, i) => {
            const input = document.getElementById(`image-url-${i + 1}`);
            if (input) {
                input.value = url;
                if (i > 0) {
                    document.getElementById(`url-${i + 1}-container`).style.display = 'block';
                }
            }
        });
        
        updateUrlButtons();
        closeModal();
    } else {
        title.textContent = 'Добавить изображение';
        submitBtn.textContent = '💾 Добавить';
        form.reset();
        currentUrlCount = 1;
        
        for (let i = 2; i <= 5; i++) {
            document.getElementById(`url-${i}-container`).style.display = 'none';
            document.getElementById(`image-url-${i}`).value = '';
        }
        
        updateUrlButtons();
    }
    
    editor.style.display = 'block';
    editor.scrollIntoView({ behavior: 'smooth' });
}

// Скрыть форму
function hideGalleryEditor() {
    document.getElementById('gallery-editor').style.display = 'none';
    document.getElementById('gallery-form').reset();
    editingIndex = -1;
}

// Управление кнопками добавления/удаления URL
function updateUrlButtons() {
    const addBtn = document.getElementById('add-url-btn');
    const removeBtn = document.getElementById('remove-url-btn');
    
    addBtn.style.display = currentUrlCount < 5 ? 'block' : 'none';
    removeBtn.style.display = currentUrlCount > 1 ? 'block' : 'none';
}

// Добавить поле URL
function addUrlField() {
    if (currentUrlCount < 5) {
        currentUrlCount++;
        document.getElementById(`url-${currentUrlCount}-container`).style.display = 'block';
        updateUrlButtons();
    }
}

// Удалить поле URL
function removeUrlField() {
    if (currentUrlCount > 1) {
        const container = document.getElementById(`url-${currentUrlCount}-container`);
        container.style.display = 'none';
        document.getElementById(`image-url-${currentUrlCount}`).value = '';
        currentUrlCount--;
        updateUrlButtons();
    }
}


// Сохранение изображения
function saveImage(e) {
    e.preventDefault();
    
    const currentUser = localStorage.getItem('currentUser');
    if (!currentUser) {
        alert('Необходимо авторизоваться');
        return;
    }
    
    const userData = JSON.parse(currentUser);
    
    const imageUrls = [];
    for (let i = 1; i <= currentUrlCount; i++) {
        const url = document.getElementById(`image-url-${i}`).value.trim();
        if (url) {
            imageUrls.push(url);
        }
    }
    
    if (imageUrls.length === 0) {
        alert('Добавьте хотя бы одно изображение');
        return;
    }
    
    const imageData = {
        imageUrl: imageUrls.length === 1 ? imageUrls[0] : imageUrls,
        title: document.getElementById('image-title').value.trim(),
        description: document.getElementById('image-description').value.trim(),
        author: userData.username,
        date: new Date().toISOString()
    };
    
    if (editingIndex >= 0) {
        const originalItem = galleryImages[editingIndex];
        if (userData.username !== originalItem.author && userData.role !== 'admin') {
            alert('У вас нет прав на редактирование этого изображения');
            return;
        }
        
        galleryImages[editingIndex] = { ...originalItem, ...imageData };
    } else {
        galleryImages.unshift(imageData);
    }
    
    saveGallery();
    renderGallery();
    hideGalleryEditor();
}

// Удаление изображения
function deleteImage() {
    if (!confirm('Удалить это изображение?')) return;
    
    const currentUser = localStorage.getItem('currentUser');
    if (!currentUser) return;
    
    const userData = JSON.parse(currentUser);
    const item = galleryImages[currentImageIndex];
    
    if (userData.username !== item.author && userData.role !== 'admin') {
        alert('У вас нет прав на удаление этого изображения');
        return;
    }
    
    galleryImages.splice(currentImageIndex, 1);
    saveGallery();
    renderGallery();
    closeModal();
}


// Инициализация
console.log('Setting up DOMContentLoaded listener');

document.addEventListener('DOMContentLoaded', () => {
    console.log('DOMContentLoaded fired in gallery.js');
    
    loadGallery();
    
    const addPhotoBtn = document.getElementById('add-photo-btn');
    console.log('Add photo button:', addPhotoBtn);
    
    if (addPhotoBtn) {
        addPhotoBtn.addEventListener('click', (e) => {
            console.log('Button clicked!', e);
            showGalleryEditor();
        });
        console.log('Event listener attached to add-photo-btn');
    } else {
        console.error('add-photo-btn not found!');
    }
    
    const cancelBtn = document.getElementById('cancel-gallery-btn');
    if (cancelBtn) cancelBtn.addEventListener('click', hideGalleryEditor);
    
    const galleryForm = document.getElementById('gallery-form');
    if (galleryForm) galleryForm.addEventListener('submit', saveImage);
    
    const modalClose = document.getElementById('modal-close');
    if (modalClose) modalClose.addEventListener('click', closeModal);
    
    const editImageBtn = document.getElementById('edit-image-btn');
    if (editImageBtn) editImageBtn.addEventListener('click', () => showGalleryEditor(currentImageIndex));
    
    const deleteImageBtn = document.getElementById('delete-image-btn');
    if (deleteImageBtn) deleteImageBtn.addEventListener('click', deleteImage);
    
    const prevBtn = document.getElementById('prev-btn');
    if (prevBtn) prevBtn.addEventListener('click', () => changeSlide(-1));
    
    const nextBtn = document.getElementById('next-btn');
    if (nextBtn) nextBtn.addEventListener('click', () => changeSlide(1));
    
    const addUrlBtn = document.getElementById('add-url-btn');
    if (addUrlBtn) addUrlBtn.addEventListener('click', addUrlField);
    
    const removeUrlBtn = document.getElementById('remove-url-btn');
    if (removeUrlBtn) removeUrlBtn.addEventListener('click', removeUrlField);
    
    window.addEventListener('click', (e) => {
        const modal = document.getElementById('gallery-modal');
        if (e.target === modal) {
            closeModal();
        }
    });
    
    document.addEventListener('keydown', (e) => {
        const modal = document.getElementById('gallery-modal');
        if (modal.style.display === 'flex') {
            if (e.key === 'Escape') {
                closeModal();
            } else if (e.key === 'ArrowLeft') {
                changeSlide(-1);
            } else if (e.key === 'ArrowRight') {
                changeSlide(1);
            }
        }
    });
    
    console.log('All event listeners attached');
});
