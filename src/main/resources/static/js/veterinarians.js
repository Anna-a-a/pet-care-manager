document.addEventListener('DOMContentLoaded', function() {
    const veterinariansContainer = document.getElementById('veterinarians');
    const veterinariansCards = document.getElementById('veterinariansCards');
    const searchVeterinarians = document.getElementById('searchVeterinarians');
    const addVeterinarianButton = document.getElementById('addVeterinarianButton');
    const addVeterinarianModal = document.getElementById('addVeterinarianModal');
    const closeAddVeterinarianModal = document.getElementById('closeAddVeterinarianModal');
    const addVeterinarianForm = document.getElementById('addVeterinarianForm');
    const editVeterinarianModal = document.getElementById('editVeterinarianModal');
    const editVeterinarianForm = document.getElementById('editVeterinarianForm');
    const deleteConfirmationModal = document.getElementById('deleteConfirmationModal');
    const closeModal = document.getElementById('closeModal');
    const confirmDelete = document.getElementById('confirmDelete');
    const cancelDelete = document.getElementById('cancelDelete');

    let currentVeterinarianId = null;

    if (!veterinariansContainer || !veterinariansCards || !searchVeterinarians || !addVeterinarianButton || !addVeterinarianModal || !closeAddVeterinarianModal || !addVeterinarianForm || !editVeterinarianModal || !editVeterinarianForm || !deleteConfirmationModal || !closeModal || !confirmDelete || !cancelDelete) {
        console.error('Элементы не найдены в DOM');
        return;
    }

    // Функция для получения списка ветеринаров
    function fetchVeterinarians() {
        fetch('/api/veterinarians')
            .then(response => {
                if (!response.ok) {
                    throw new Error('Ошибка загрузки ветеринаров: ' + response.statusText);
                }
                return response.json();
            })
            .then(data => {
                veterinariansCards.innerHTML = ''; // Очистка контейнера
                data.forEach(veterinarian => {
                    const veterinarianCard = document.createElement('div');
                    veterinarianCard.className = 'owner-card';
                    veterinarianCard.innerHTML = `
                        <h3>${veterinarian.lastName} ${veterinarian.firstName} </h3>
                        <h3>${veterinarian.middleName}</h3>
                        <div class="owner-info">
                            <div><label>ID:</label> <span>${veterinarian.id}</span></div>
                            <div><label>Специализация:</label> <span>${veterinarian.specialization}</span></div>
                        </div>
                        <button class="edit-button"><i class="fas fa-edit"></i></button>
                        <button class="delete-button" data-veterinarian-id="${veterinarian.id}"><i class="fas fa-trash"></i></button>
                    `;
                    veterinariansCards.appendChild(veterinarianCard);

                    // Добавление обработчиков для кнопок
                    veterinarianCard.querySelector('.delete-button').addEventListener('click', () => openDeleteConfirmation(veterinarian.id));
                    veterinarianCard.querySelector('.edit-button').addEventListener('click', () => openEditVeterinarianForm(veterinarian));
                });
                veterinariansContainer.style.display = 'block'; // Отображение контейнера
            })
            .catch(error => console.error('Ошибка загрузки ветеринаров:', error));
    }

    // Функция для открытия модального окна подтверждения удаления
    function openDeleteConfirmation(id) {
        currentVeterinarianId = id;
        deleteConfirmationModal.style.display = 'block';
    }

    // Функция для закрытия модального окна
    function closeDeleteModal() {
        deleteConfirmationModal.style.display = 'none';
    }

    // Обработчик события для кнопки подтверждения удаления
    confirmDelete.addEventListener('click', () => {
        if (currentVeterinarianId !== null) {
            fetch(`/api/deleteVeterinarian/${currentVeterinarianId}`, { method: 'DELETE' })
                .then(response => {
                    if (response.ok) {
                        closeDeleteModal();
                        fetchVeterinarians(); // Перезагрузка списка ветеринаров
                    } else {
                        alert('Ошибка при удалении ветеринара');
                    }
                })
                .catch(error => console.error('Ошибка при удалении ветеринара:', error));
        }
    });

    // Обработчик события для кнопки отмены удаления
    cancelDelete.addEventListener('click', closeDeleteModal);
    closeModal.addEventListener('click', closeDeleteModal);

    // Функция для открытия формы редактирования ветеринара
    function openEditVeterinarianForm(veterinarian) {
        document.getElementById('editLastName').value = veterinarian.lastName;
        document.getElementById('editFirstName').value = veterinarian.firstName;
        document.getElementById('editMiddleName').value = veterinarian.middleName;
        document.getElementById('editSpecialization').value = veterinarian.specialization;
        currentVeterinarianId = veterinarian.id;
        editVeterinarianModal.style.display = 'block';
    }

    // Обработчик события для отправки формы редактирования ветеринара
    editVeterinarianForm.addEventListener('submit', function(event) {
        event.preventDefault();

        const updatedVeterinarian = {
            id: currentVeterinarianId,
            lastName: document.getElementById('editLastName').value,
            firstName: document.getElementById('editFirstName').value,
            middleName: document.getElementById('editMiddleName').value,
            specialization: document.getElementById('editSpecialization').value
        };

        fetch(`/api/updateVeterinarian/${currentVeterinarianId}`, {
            method: 'PUT',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify(updatedVeterinarian)
        })
        .then(response => {
            if (response.ok) {
                alert('Ветеринар обновлен!');
                fetchVeterinarians(); // Перезагрузка списка ветеринаров
                editVeterinarianModal.style.display = 'none';
            } else {
                return response.json().then(errorData => {
                    alert(`Ошибка при обновлении ветеринара: ${errorData.message || 'Неизвестная ошибка'}`);
                });
            }
        })
        .catch(error => {
            console.error('Ошибка при обновлении ветеринара:', error);
            alert('Ошибка при обновлении ветеринара. Проверьте консоль для подробностей.');
        });
    });

    // Обработчик события для кнопки добавления нового ветеринара
    addVeterinarianButton.addEventListener('click', function() {
        addVeterinarianModal.style.display = 'block';
    });

    // Обработчик события для закрытия модального окна добавления нового ветеринара
    closeAddVeterinarianModal.addEventListener('click', function() {
        addVeterinarianModal.style.display = 'none';
    });

    // Обработчик события для отправки формы добавления нового ветеринара
    addVeterinarianForm.addEventListener('submit', function(event) {
        event.preventDefault();

        const newVeterinarian = {
            lastName: document.getElementById('addLastName').value,
            firstName: document.getElementById('addFirstName').value,
            middleName: document.getElementById('addMiddleName').value,
            specialization: document.getElementById('addSpecialization').value
        };

        fetch('/api/veterinarian', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify(newVeterinarian)
        })
        .then(response => {
            if (response.ok) {
                alert('Ветеринар добавлен!');
                fetchVeterinarians(); // Перезагрузка списка ветеринаров
                addVeterinarianModal.style.display = 'none';
            } else {
                return response.json().then(errorData => {
                    alert(`Ошибка при добавлении ветеринара: ${errorData.message || 'Неизвестная ошибка'}`);
                });
            }
        })
        .catch(error => {
            console.error('Ошибка при добавлении ветеринара:', error);
            alert('Ошибка при добавлении ветеринара. Проверьте консоль для подробностей.');
        });
    });

    // Обработчик события для поиска ветеринаров
    searchVeterinarians.addEventListener('input', function() {
        const query = searchVeterinarians.value.toLowerCase();
        const veterinarianCards = veterinariansCards.getElementsByClassName('veterinarian-card');
        for (let i = 0; i < veterinarianCards.length; i++) {
            const card = veterinarianCards[i];
            const text = card.textContent.toLowerCase();
            if (text.includes(query)) {
                card.style.display = '';
            } else {
                card.style.display = 'none';
            }
        }
    });

    // Загрузка ветеринаров при загрузке страницы
    fetchVeterinarians();
});
