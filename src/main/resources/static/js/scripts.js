document.addEventListener('DOMContentLoaded', function() {
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

    addVisitButton.addEventListener('click', function() {
        addVisitModal.style.display = 'block';
    });

    closeAddVisitModal.addEventListener('click', function() {
        addVisitModal.style.display = 'none';
    });

    let visitIdToDelete = null;
    let currentVisit = null;

    sidebar.classList.add('open');
    mainContent.style.marginLeft = '250px';

    function openEditVisitForm(visit) {
        currentVisit = visit;

        document.getElementById('editVeterinarianId').value = visit.veterinarianId || '';
        document.getElementById('editVisitDate').value = visit.visitDate ? new Date(visit.visitDate).toISOString().split('T')[0] : '';
        document.getElementById('editDiagnosis').value = visit.diagnosis || '';
        document.getElementById('editTreatment').value = visit.treatment || '';
        document.getElementById('editDoctorComments').value = visit.doctorComments || '';

        editVisitModal.style.display = 'block';
    }

    cancelEditButton.addEventListener('click', () => {
        editVisitModal.style.display = 'none';
    });

    toggleSidebarButton.addEventListener('click', () => {
        sidebar.classList.toggle('open');
        sidebar.classList.toggle('closed');
        mainContent.style.marginLeft = sidebar.classList.contains('open') ? '250px' : '0';
    });

    closeSidebarButton.addEventListener('click', () => {
        sidebar.classList.remove('open');
        sidebar.classList.add('closed');
        mainContent.style.marginLeft = '0';
    });

    function openDeleteConfirmation(visitId) {
        visitIdToDelete = visitId;
        deleteConfirmationModal.style.display = 'block';
    }

    function closeDeleteModal() {
        deleteConfirmationModal.style.display = 'none';
    }

    closeModalButton.addEventListener('click', closeDeleteModal);
    cancelDeleteButton.addEventListener('click', closeDeleteModal);

    confirmDeleteButton.addEventListener('click', () => {
        if (visitIdToDelete !== null) {
            fetch(`/api/deleteVisit/${visitIdToDelete}`, { method: 'DELETE' })
                .then(response => {
                    if (response.ok) {
                        closeDeleteModal();
                        fetchVisits();
                    } else {
                        alert('Ошибка при удалении визита');
                    }
                })
                .catch(error => console.error('Ошибка при удалении визита:', error));
        }
    });

    document.querySelector(".toggle-sidebar").addEventListener("click", function () {
        window.location.href = "index.html";
    });

    function fetchVisits() {
        fetch('/api/visits')
            .then(response => {
                if (!response.ok) {
                    throw new Error('Ошибка загрузки визитов: ' + response.statusText);
                }
                return response.json();
            })
            .then(data => {
                visitsCards.innerHTML = '';
                data.forEach(visit => {
                    const visitCard = document.createElement('div');
                    visitCard.className = 'visit-card';
                    visitCard.innerHTML = `
                        <button class="edit-button"><i class="fas fa-edit"></i></button>
                        <h3>Визит от ${new Date(visit.visitDate).toLocaleDateString()}</h3>
                        <div class="visit-info">
                            <div><label>Паспорт животного:</label> <span>${visit.petPassport}</span></div>
                            <div><label>ID Ветеринара:</label> <span>${visit.veterinarianId}</span></div>
                            <div><label>ФИО Ветеринара:</label> <span>${visit.veterinarianLastName} ${visit.veterinarianFirstName} ${visit.veterinarianMiddleName}</span></div>
                            <div><label>Диагноз:</label> <span>${visit.diagnosis}</span></div>
                            <div><label>Лечение:</label> <span>${visit.treatment}</span></div>
                            <div><label>Комментарии Доктора:</label> <span>${visit.doctorComments}</span></div>
                        </div>
                        <button class="delete-button" data-visit-id="${visit.id}"><i class="fas fa-trash"></i></button>
                    `;

                    visitCard.querySelector('.delete-button').addEventListener('click', () => openDeleteConfirmation(visit.id));
                    visitCard.querySelector('.edit-button').addEventListener('click', () => openEditVisitForm(visit));

                    visitsCards.appendChild(visitCard);
                });
            })
            .catch(error => console.error('Ошибка загрузки визитов:', error));
    }

    editVisitForm.addEventListener('submit', function(event) {
        event.preventDefault();

        const updatedVisit = {
            id: currentVisit.id,
            veterinarianId: document.getElementById('editVeterinarianId').value,
            visitDate: document.getElementById('editVisitDate').value,
            diagnosis: document.getElementById('editDiagnosis').value,
            treatment: document.getElementById('editTreatment').value,
            doctorComments: document.getElementById('editDoctorComments').value
        };

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
                fetchVisits();
                editVisitModal.style.display = 'none';
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

    addVisitForm.addEventListener('submit', function(event) {
        event.preventDefault();

        const addPetPassport = document.getElementById('addPetPassport');
        const addVeterinarianId = document.getElementById('addVeterinarianId');
        const addVisitDate = document.getElementById('addVisitDate');
        const addDiagnosis = document.getElementById('addDiagnosis');
        const addTreatment = document.getElementById('addTreatment');
        const addDoctorComments = document.getElementById('addDoctorComments');

        if (addPetPassport && addVeterinarianId && addVisitDate && addDiagnosis && addTreatment && addDoctorComments) {
            const newVisit = {
                petPassport: addPetPassport.value,
                veterinarianId: addVeterinarianId.value,
                visitDate: addVisitDate.value,
                diagnosis: addDiagnosis.value,
                treatment: addTreatment.value,
                doctorComments: addDoctorComments.value
            };

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
                    fetchVisits();
                    addVisitModal.style.display = 'none';
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
        } else {
            alert('Ошибка: Один или несколько элементов формы не найдены.');
        }
    });

    window.addEventListener('click', function(event) {
        if (event.target === addVisitModal) {
            addVisitModal.style.display = 'none';
        }
    });

    fetchVisits();
});
