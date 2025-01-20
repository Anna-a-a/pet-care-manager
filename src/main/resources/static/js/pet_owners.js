document.addEventListener('DOMContentLoaded', function() {
    const petOwnersContainer = document.getElementById('pet-owners');
    const petOwnersCards = document.getElementById('petOwnersCards');
    const searchPetOwners = document.getElementById('searchPetOwners');
    const addOwnerButton = document.getElementById('addOwnerButton');
    const addOwnerModal = document.getElementById('addOwnerModal');
    const closeAddOwnerModal = document.getElementById('closeAddOwnerModal');
    const addOwnerForm = document.getElementById('addOwnerForm');
    const editOwnerModal = document.getElementById('editOwnerModal');
    const editOwnerForm = document.getElementById('editOwnerForm');
    const deleteConfirmationModal = document.getElementById('deleteConfirmationModal');
    const closeModal = document.getElementById('closeModal');
    const confirmDelete = document.getElementById('confirmDelete');
    const cancelDelete = document.getElementById('cancelDelete');

    let currentOwnerId = null;

    if (!petOwnersContainer || !petOwnersCards || !searchPetOwners || !addOwnerButton || !addOwnerModal || !closeAddOwnerModal || !addOwnerForm || !editOwnerModal || !editOwnerForm || !deleteConfirmationModal || !closeModal || !confirmDelete || !cancelDelete) {
        console.error('Элементы не найдены в DOM');
        return;
    }

    // Функция для получения списка владельцев животных
    function fetchPetOwners() {
        fetch('/api/petOwners')
            .then(response => {
                if (!response.ok) {
                    throw new Error('Ошибка загрузки владельцев животных: ' + response.statusText);
                }
                return response.json();
            })
            .then(data => {
                petOwnersCards.innerHTML = ''; // Очистка контейнера
                data.forEach(owner => {
                    const ownerCard = document.createElement('div');
                    ownerCard.className = 'owner-card';
                    ownerCard.innerHTML = `
                        <h3>${owner.lastName} ${owner.firstName} ${owner.middleName}</h3>
                        <div class="owner-info">
                            <div><label>ИНН:</label> <span>${owner.inn}</span></div>
                        </div>
                        <button class="edit-button"><i class="fas fa-edit"></i></button>
                        <button class="delete-button" data-owner-inn="${owner.inn}"><i class="fas fa-trash"></i></button>
                    `;
                    petOwnersCards.appendChild(ownerCard);

                    // Добавление обработчиков для кнопок
                    ownerCard.querySelector('.delete-button').addEventListener('click', () => openDeleteConfirmation(owner.inn));
                    ownerCard.querySelector('.edit-button').addEventListener('click', () => openEditOwnerForm(owner));
                });
                petOwnersContainer.style.display = 'block'; // Отображение контейнера
            })
            .catch(error => console.error('Ошибка загрузки владельцев животных:', error));
    }

    // Функция для открытия модального окна подтверждения удаления
    function openDeleteConfirmation(inn) {
        currentOwnerId = inn;
        deleteConfirmationModal.style.display = 'block';
    }

    // Функция для закрытия модального окна
    function closeDeleteModal() {
        deleteConfirmationModal.style.display = 'none';
    }

    // Обработчик события для кнопки подтверждения удаления
    confirmDelete.addEventListener('click', () => {
        if (currentOwnerId !== null) {
            fetch(`/api/deletePetOwner/${currentOwnerId}`, { method: 'DELETE' })
                .then(response => {
                    if (response.ok) {
                        closeDeleteModal();
                        fetchPetOwners(); // Перезагрузка списка владельцев
                    } else {
                        alert('Ошибка при удалении владельца');
                    }
                })
                .catch(error => console.error('Ошибка при удалении владельца:', error));
        }
    });

    // Обработчик события для кнопки отмены удаления
    cancelDelete.addEventListener('click', closeDeleteModal);
    closeModal.addEventListener('click', closeDeleteModal);

    // Функция для открытия формы редактирования владельца
    function openEditOwnerForm(owner) {
        document.getElementById('editLastName').value = owner.lastName;
        document.getElementById('editFirstName').value = owner.firstName;
        document.getElementById('editMiddleName').value = owner.middleName;
        document.getElementById('editInn').value = owner.inn;
        currentOwnerId = owner.id;
        editOwnerModal.style.display = 'block';
    }

    // Обработчик события для отправки формы редактирования владельца
    editOwnerForm.addEventListener('submit', function(event) {
        event.preventDefault();

        const updatedOwner = {
            id: currentOwnerId,
            lastName: document.getElementById('editLastName').value,
            firstName: document.getElementById('editFirstName').value,
            middleName: document.getElementById('editMiddleName').value,
            inn: document.getElementById('editInn').value
        };

        fetch(`/api/updatePetOwner/${currentOwnerId}`, {
            method: 'PUT',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify(updatedOwner)
        })
        .then(response => {
            if (response.ok) {
                alert('Владелец обновлен!');
                fetchPetOwners(); // Перезагрузка списка владельцев
                editOwnerModal.style.display = 'none';
            } else {
                return response.json().then(errorData => {
                    alert(`Ошибка при обновлении владельца: ${errorData.message || 'Неизвестная ошибка'}`);
                });
            }
        })
        .catch(error => {
            console.error('Ошибка при обновлении владельца:', error);
            alert('Ошибка при обновлении владельца. Проверьте консоль для подробностей.');
        });
    });

    // Обработчик события для кнопки добавления нового владельца
    addOwnerButton.addEventListener('click', function() {
        addOwnerModal.style.display = 'block';
    });

    // Обработчик события для закрытия модального окна добавления нового владельца
    closeAddOwnerModal.addEventListener('click', function() {
        addOwnerModal.style.display = 'none';
    });

    // Обработчик события для отправки формы добавления нового владельца
    addOwnerForm.addEventListener('submit', function(event) {
        event.preventDefault();

        const newOwner = {
            lastName: document.getElementById('addLastName').value,
            firstName: document.getElementById('addFirstName').value,
            middleName: document.getElementById('addMiddleName').value,
            inn: document.getElementById('addInn').value
        };

        fetch('/api/addPetOwner', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify(newOwner)
        })
        .then(response => {
            if (response.ok) {
                alert('Владелец добавлен!');
                fetchPetOwners(); // Перезагрузка списка владельцев
                addOwnerModal.style.display = 'none';
            } else {
                return response.json().then(errorData => {
                    alert(`Ошибка при добавлении владельца: ${errorData.message || 'Неизвестная ошибка'}`);
                });
            }
        })
        .catch(error => {
            console.error('Ошибка при добавлении владельца:', error);
            alert('Ошибка при добавлении владельца. Проверьте консоль для подробностей.');
        });
    });

    // Обработчик события для поиска владельцев животных
    searchPetOwners.addEventListener('input', function() {
        const query = searchPetOwners.value.toLowerCase();
        const ownerCards = petOwnersCards.getElementsByClassName('owner-card');
        for (let i = 0; i < ownerCards.length; i++) {
            const card = ownerCards[i];
            const text = card.textContent.toLowerCase();
            if (text.includes(query)) {
                card.style.display = '';
            } else {
                card.style.display = 'none';
            }
        }
    });

    // Загрузка владельцев животных при загрузке страницы
    fetchPetOwners();
});
