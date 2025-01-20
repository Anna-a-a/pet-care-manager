document.addEventListener('DOMContentLoaded', function() {
    const petsContainer = document.getElementById('pets');
    const petsCards = document.getElementById('petsCards');
    const deleteConfirmationModal = document.getElementById('deletePetConfirmationModal');
    const closePetModal = document.getElementById('closePetModal');
    const confirmPetDelete = document.getElementById('confirmPetDelete');
    const cancelPetDelete = document.getElementById('cancelPetDelete');
    const editPetModal = document.getElementById('editPetModal');
    const editPetForm = document.getElementById('editPetForm');
    const closeEditPetModal = document.getElementById('cancelEditPetButton');
    const addPetModal = document.getElementById('addPetModal');
    const addPetForm = document.getElementById('addPetForm');
    const closeAddPetModal = document.getElementById('closeAddPetModal');
    const addPetButton = document.getElementById('addPetButton');

    let currentPetId = null;

    if (!petsContainer || !petsCards || !deleteConfirmationModal || !closePetModal || !confirmPetDelete || !cancelPetDelete || !editPetModal || !editPetForm || !closeEditPetModal || !addPetModal || !addPetForm || !closeAddPetModal || !addPetButton) {
        console.error('Элементы не найдены в DOM');
        return;
    }

    // Функция для получения списка животных
    function fetchPets() {
        fetch('/api/pets')
            .then(response => {
                if (!response.ok) {
                    throw new Error('Ошибка загрузки животных: ' + response.statusText);
                }
                return response.json();
            })
            .then(data => {
                console.log('Данные, полученные от API:', data); // Вывод данных в консоль
                petsCards.innerHTML = ''; // Очистка контейнера
                data.forEach(pet => {
                    const petCard = document.createElement('div');
                    petCard.className = 'owner-card';
                    petCard.innerHTML = `
                        <h3>${pet.nickname}</h3>
                        <div class="owner-info">
                            <div><label>Вид животного:</label> <span>${pet.petSpecies}</span></div>
                            <div><label>Порода:</label> <span>${pet.breed}</span></div>
                            <div><label>Номер паспорта:</label> <span>${pet.passportNumber}</span></div>
                            <div><label>ИНН владельца:</label> <span>${pet.ownerInn}</span></div>
                        </div>
                        <button class="edit-button"><i class="fas fa-edit"></i></button>
                        <button class="delete-button" data-pet-id="${pet.id}"><i class="fas fa-trash"></i></button>
                    `;
                    petsCards.appendChild(petCard);

                    // Добавление обработчиков для кнопок
                    petCard.querySelector('.delete-button').addEventListener('click', () => openDeleteConfirmation(pet.id));
                    petCard.querySelector('.edit-button').addEventListener('click', () => openEditPetForm(pet));
                });
                petsContainer.style.display = 'block'; // Отображение контейнера
            })
            .catch(error => console.error('Ошибка загрузки животных:', error));
    }

    // Функция для открытия модального окна подтверждения удаления
    function openDeleteConfirmation(id) {
        currentPetId = id;
        deleteConfirmationModal.style.display = 'block';
    }

    // Функция для закрытия модального окна
    function closeDeleteModal() {
        deleteConfirmationModal.style.display = 'none';
    }

    // Обработчик события для кнопки подтверждения удаления
    confirmPetDelete.addEventListener('click', () => {
        if (currentPetId !== null) {
            fetch(`/api/pet/${currentPetId}`, { method: 'DELETE' })
                .then(response => {
                    if (response.ok) {
                        closeDeleteModal();
                        fetchPets(); // Перезагрузка списка животных
                    } else {
                        alert('Ошибка при удалении животного');
                    }
                })
                .catch(error => console.error('Ошибка при удалении животного:', error));
        }
    });

    // Обработчик события для кнопки отмены удаления
    cancelPetDelete.addEventListener('click', closeDeleteModal);
    closePetModal.addEventListener('click', closeDeleteModal);

    // Функция для открытия формы редактирования животного
    function openEditPetForm(pet) {
        document.getElementById('editNickname').value = pet.nickname;
        document.getElementById('editBreed').value = pet.breed;
        document.getElementById('editPetSpecies').value = pet.petSpecies;
        document.getElementById('editPassportNumber').value = pet.passportNumber;
        document.getElementById('editOwnerInn').value = pet.ownerInn;
        currentPetId = pet.id;
        editPetModal.style.display = 'block';
    }

    // Обработчик события для отправки формы редактирования животного
    editPetForm.addEventListener('submit', function(event) {
        event.preventDefault();

        const updatedPet = {
            id: currentPetId,
            nickname: document.getElementById('editNickname').value,
            breed: document.getElementById('editBreed').value,
            petSpecies: document.getElementById('editPetSpecies').value,
            passportNumber: document.getElementById('editPassportNumber').value,
            ownerInn: document.getElementById('editOwnerInn').value
        };

        fetch('/api/updatePet', {
            method: 'PUT',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify(updatedPet)
        })
        .then(response => {
            if (response.ok) {
                alert('Животное обновлено!');
                fetchPets(); // Перезагрузка списка животных
                editPetModal.style.display = 'none';
            } else {
                return response.json().then(errorData => {
                    throw new Error(`Ошибка при обновлении животного: ${errorData.message || 'Неизвестная ошибка'}`);
                });
            }
        })
        .catch(error => {
            console.error('Ошибка при обновлении животного:', error);
            alert('Ошибка при обновлении животного. Проверьте консоль для подробностей.');
        });
    });

    // Обработчик события для закрытия модального окна редактирования
    closeEditPetModal.addEventListener('click', function() {
        editPetModal.style.display = 'none';
    });

    // Функция для открытия формы добавления нового животного
    addPetButton.addEventListener('click', function() {
        addPetModal.style.display = 'block';
    });

    // Обработчик события для отправки формы добавления нового животного
    addPetForm.addEventListener('submit', function(event) {
        event.preventDefault();

        const newPet = {
            nickname: document.getElementById('addNickname').value,
            breed: document.getElementById('addBreed').value,
            petSpecies: document.getElementById('addPetSpecies').value,
            passportNumber: document.getElementById('addPassportNumber').value,
            ownerInn: document.getElementById('addOwnerInn').value
        };

        fetch('/api/pet', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify(newPet)
        })
        .then(response => {
            if (response.ok) {
                alert('Животное добавлено!');
                fetchPets(); // Перезагрузка списка животных
                addPetModal.style.display = 'none';
            } else {
                return response.json().then(errorData => {
                    throw new Error(`Ошибка при добавлении животного: ${errorData.message || 'Неизвестная ошибка'}`);
                });
            }
        })
        .catch(error => {
            console.error('Ошибка при добавлении животного:', error);
            alert('Ошибка при добавлении животного. Проверьте консоль для подробностей.');
        });
    });

    // Обработчик события для закрытия модального окна добавления нового животного
    closeAddPetModal.addEventListener('click', function() {
        addPetModal.style.display = 'none';
    });

    // Загрузка животных при загрузке страницы
    fetchPets();
});
