document.addEventListener('DOMContentLoaded', function() {
    // Проверка, что элементы существуют
    const editVisitModal = document.getElementById('editVisitModal');
    const cancelEditButton = document.getElementById('cancelEditButton');
    const editVisitForm = document.getElementById('editVisitForm');
    const toggleSidebarButton = document.getElementById('toggle-sidebar');
    const closeSidebarButton = document.getElementById('close-sidebar');
    const sidebar = document.querySelector('.sidebar');
    const mainContent = document.querySelector('.main-content');
    const deleteConfirmationModal = document.getElementById('deleteConfirmationModal');
    const closeModalButton = document.getElementById('closeModal');
    const confirmDeleteButton = document.getElementById('confirmDelete');
    const cancelDeleteButton = document.getElementById('cancelDelete');
    const visitsCards = document.getElementById('visits-cards');
    const addVisitButton = document.getElementById('addVisitButton');
    const addVisitModal = document.getElementById('addVisitModal');
    const closeAddVisitModal = document.getElementById('closeAddVisitModal');
    const addVisitForm = document.getElementById('addVisitForm');


    // Open the modal when the "+" button is clicked
    addVisitButton.addEventListener('click', function() {
        addVisitModal.style.display = 'block';
    });

    // Close the modal when the "X" button is clicked
    closeAddVisitModal.addEventListener('click', function() {
        addVisitModal.style.display = 'none';
    });

    let visitIdToDelete = null;
    let currentVisit = null;

    // Убедитесь, что sidebar открывается по умолчанию
    sidebar.classList.add('open'); // По умолчанию sidebar открыт
    mainContent.style.marginLeft = '250px'; // Смещаем контент, чтобы учесть ширину sidebar

    // Функция для открытия формы редактирования
    function openEditVisitForm(visit) {
        currentVisit = visit;

        // Заполняем поля формы данными визита
        document.getElementById('editDiagnosis').value = visit.diagnosis || '';
        document.getElementById('editTreatment').value = visit.treatment || '';
        document.getElementById('editDoctorComments').value = visit.doctorComments || '';

        // Открытие модального окна
        editVisitModal.style.display = 'block';
    }



    cancelEditButton.addEventListener('click', () => {
        editVisitModal.style.display = 'none';
    });

    // Открытие и закрытие бокового меню
    toggleSidebarButton.addEventListener('click', () => {
        sidebar.classList.toggle('open'); // Переключение класса 'open' для панели
        sidebar.classList.toggle('closed'); // Переключение класса 'closed' для скрытия панели
        mainContent.style.marginLeft = sidebar.classList.contains('open') ? '250px' : '0'; // Смещение контента в зависимости от состояния панели
    });

    closeSidebarButton.addEventListener('click', () => {
        sidebar.classList.remove('open');
        sidebar.classList.add('closed');
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

    // Если требуется скрывать или показывать sidebar
    document.querySelector(".toggle-sidebar").addEventListener("click", function () {
        window.location.href = "index.html"; // Переход на главную страницу
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
                        openEditVisitForm(visit); // Вызов функции для открытия модального окна с визитом
                    });

                    visitsCards.appendChild(visitCard);
                });
            })
            .catch(error => console.error('Ошибка загрузки визитов:', error));
    }

    // Отправка обновленных данных визита
    editVisitForm.addEventListener('submit', function(event) {
        event.preventDefault();  // Отключаем стандартное поведение формы

        const updatedVisit = {
            id: currentVisit.id,  // Убедитесь, что отправляете ID визита
            petId: document.getElementById('editPetId').value,
            veterinarianId: document.getElementById('editVeterinarianId').value,
            visitDate: document.getElementById('editVisitDate').value, // Дата визита
            diagnosis: document.getElementById('editDiagnosis').value,
            treatment: document.getElementById('editTreatment').value,
            doctorComments: document.getElementById('editDoctorComments').value
        };

        // Отправляем обновленные данные визита на сервер через API
        fetch(`/api/updateVisit/${currentVisit.id}`, {
            method: 'PUT',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify(updatedVisit)
        })
        .then(response => {
            if (response.ok) {
                alert('Визит обновлен!');
                fetchVisits();  // Обновляем список визитов
                editVisitModal.style.display = 'none';  // Закрываем модальное окно
            } else {
                return response.json().then(errorData => {
                    alert(`Ошибка при обновлении визита: ${errorData.message || 'Неизвестная ошибка'}`);
                });
            }
        })
        .catch(error => {
            console.error('Ошибка при обновлении визита:', error);
            alert('Ошибка при обновлении визита. Проверьте консоль для подробностей.');
        });
    });
     // Submit the form to add a new visit
        addVisitForm.addEventListener('submit', function(event) {
            event.preventDefault(); // Prevent the form from reloading the page

            const newVisit = {
                petId: document.getElementById('addPetId').value,
                veterinarianId: document.getElementById('addVeterinarianId').value,
                visitDate: document.getElementById('addVisitDate').value,
                diagnosis: document.getElementById('addDiagnosis').value,
                treatment: document.getElementById('addTreatment').value,
                doctorComments: document.getElementById('addDoctorComments').value
            };

            // Send the data to the backend via POST request
            fetch('/api/visit', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify(newVisit)
            })
            .then(response => {
                if (response.ok) {
                    alert('Визит добавлен!');
                    fetchVisits();  // Refresh the visits list
                    addVisitModal.style.display = 'none';  // Close the modal
                } else {
                    return response.json().then(errorData => {
                        alert(`Ошибка при добавлении визита: ${errorData.message || 'Неизвестная ошибка'}`);
                    });
                }
            })
            .catch(error => {
                console.error('Ошибка при добавлении визита:', error);
                alert('Ошибка при добавлении визита. Проверьте консоль для подробностей.');
            });
        });

        // Close the modal when clicking outside of it
        window.addEventListener('click', function(event) {
            if (event.target === addVisitModal) {
                addVisitModal.style.display = 'none';
            }
        });
    // Загрузка визитов при загрузке страницы
    fetchVisits();
});
