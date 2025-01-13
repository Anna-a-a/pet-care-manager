document.addEventListener('DOMContentLoaded', function() {
    const toggleSidebarButton = document.getElementById('toggle-sidebar');
    const closeSidebarButton = document.getElementById('close-sidebar');
    const sidebar = document.getElementById('sidebar');
    const mainContent = document.querySelector('.main-content');
    const deleteConfirmationModal = document.getElementById('deleteConfirmationModal');
    const closeModalButton = document.getElementById('closeModal');
    const confirmDeleteButton = document.getElementById('confirmDelete');
    const cancelDeleteButton = document.getElementById('cancelDelete');
    const visitsCards = document.getElementById('visits-cards');

    let visitIdToDelete = null;

    // Открытие и закрытие бокового меню
    toggleSidebarButton.addEventListener('click', () => {
        sidebar.classList.add('open');
        mainContent.style.marginLeft = '250px';
    });

    closeSidebarButton.addEventListener('click', () => {
        sidebar.classList.remove('open');
        mainContent.style.marginLeft = '0';
    });

    // Открытие модального окна подтверждения удаления
    function openDeleteConfirmation(visitId) {
        visitIdToDelete = visitId;
        deleteConfirmationModal.style.display = 'block';
    }

    // Закрытие модального окна
    function closeDeleteModal() {
        deleteConfirmationModal.style.display = 'none';
    }

    // Закрытие модального окна через кнопку
    closeModalButton.addEventListener('click', closeDeleteModal);
    cancelDeleteButton.addEventListener('click', closeDeleteModal);

    // Удаление визита
    confirmDeleteButton.addEventListener('click', () => {
        if (visitIdToDelete !== null) {
            fetch(`/api/deleteVisit/${visitIdToDelete}`, { method: 'DELETE' })
                .then(response => {
                    if (response.ok) {
                        closeDeleteModal();
                        fetchVisits(); // Перезагрузка списка визитов
                    } else {
                        alert('Ошибка при удалении визита');
                    }
                })
                .catch(error => console.error('Ошибка при удалении визита:', error));
        }
    });

    // Получение списка визитов
    function fetchVisits() {
        fetch('/api/visits')
            .then(response => {
                if (!response.ok) {
                    throw new Error('Ошибка загрузки визитов: ' + response.statusText);
                }
                return response.json();
            })
            .then(data => {
                visitsCards.innerHTML = ''; // Очистка контейнера
                data.forEach(visit => {
                    const visitCard = document.createElement('div');
                    visitCard.className = 'visit-card';
                    visitCard.innerHTML = `
                        <button class="edit-button"><i class="fas fa-edit"></i></button>
                        <h3>Визит от ${new Date(visit.visitDate).toLocaleDateString()}</h3>
                        <div class="visit-info">
                            <div><label>ID Животного:</label> <span>${visit.petId}</span></div>
                            <div><label>ID Ветеринара:</label> <span>${visit.veterinarianId}</span></div>
                            <div><label>Диагноз:</label> <span>${visit.diagnosis}</span></div>
                            <div><label>Лечение:</label> <span>${visit.treatment}</span></div>
                            <div><label>Комментарии Доктора:</label> <span>${visit.doctorComments}</span></div>
                        </div>
                        <button class="delete-button" data-visit-id="${visit.id}"><i class="fas fa-trash"></i></button>
                    `;

                    // Добавление обработчиков для кнопок
                    visitCard.querySelector('.delete-button').addEventListener('click', () => openDeleteConfirmation(visit.id));
                    visitCard.querySelector('.edit-button').addEventListener('click', () => {
                        console.log(`Редактировать визит: ${visit.id}`);
                    });

                    visitsCards.appendChild(visitCard);
                });
            })
            .catch(error => console.error('Ошибка загрузки визитов:', error));
    }

    // Загрузка визитов при загрузке страницы
    fetchVisits();
});
