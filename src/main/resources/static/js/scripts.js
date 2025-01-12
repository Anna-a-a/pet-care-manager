document.addEventListener('DOMContentLoaded', function() {
    const toggleSidebarButton = document.getElementById('toggle-sidebar');
    const closeSidebarButton = document.getElementById('close-sidebar');
    const sidebar = document.getElementById('sidebar');
    const mainContent = document.querySelector('.main-content');

    toggleSidebarButton.addEventListener('click', function() {
        sidebar.classList.add('open');
        mainContent.style.marginLeft = '250px';
    });

    closeSidebarButton.addEventListener('click', function() {
        sidebar.classList.remove('open');
        mainContent.style.marginLeft = '0';
    });

    // Fetch and display pet owners
    fetch('/api/petOwners')
        .then(response => response.json())
        .then(data => {
            const petOwnersList = document.getElementById('pet-owners-list');
            data.forEach(owner => {
                const ownerElement = document.createElement('div');
                ownerElement.innerHTML = `
                    <h3>${owner.firstName} ${owner.lastName}</h3>
                    <p>INN: ${owner.inn}</p>
                    <button onclick="deletePetOwner(${owner.inn})">Delete</button>
                `;
                petOwnersList.appendChild(ownerElement);
            });
        });

    // Fetch and display pets
    fetch('/api/pets')
        .then(response => response.json())
        .then(data => {
            const petsList = document.getElementById('pets-list');
            data.forEach(pet => {
                const petElement = document.createElement('div');
                petElement.innerHTML = `
                    <h3>${pet.nickname}</h3>
                    <p>Breed: ${pet.breed}</p>
                    <p>Species: ${pet.petSpecies}</p>
                    <p>Passport Number: ${pet.passportNumber}</p>
                    <button onclick="deletePet(${pet.id})">Delete</button>
                `;
                petsList.appendChild(petElement);
            });
        });

    // Fetch and display veterinarians
    fetch('/api/veterinarians')
        .then(response => response.json())
        .then(data => {
            const veterinariansList = document.getElementById('veterinarians-list');
            data.forEach(vet => {
                const vetElement = document.createElement('div');
                vetElement.innerHTML = `
                    <h3>${vet.firstName} ${vet.lastName}</h3>
                    <p>Specialization: ${vet.specialization}</p>
                `;
                veterinariansList.appendChild(vetElement);
            });
        });

    // Fetch and display visits
    fetch('/api/visits')
        .then(response => response.json())
        .then(data => {
            const visitsList = document.getElementById('visits-list');
            data.forEach(visit => {
                const visitElement = document.createElement('div');
                visitElement.innerHTML = `
                    <h3>Visit Date: ${visit.visitDate}</h3>
                    <p>Pet ID: ${visit.petId}</p>
                    <p>Veterinarian ID: ${visit.veterinarianId}</p>
                    <p>Diagnosis: ${visit.diagnosis}</p>
                    <p>Treatment: ${visit.treatment}</p>
                    <p>Doctor Comments: ${visit.doctorComments}</p>
                `;
                visitsList.appendChild(visitElement);
            });
        });
});

function deletePetOwner(inn) {
    fetch(`/api/petOwner/${inn}`, {
        method: 'DELETE'
    })
    .then(response => response.json())
    .then(data => {
        alert('Pet Owner deleted successfully');
        location.reload();
    })
    .catch(error => console.error('Error:', error));
}

function deletePet(id) {
    fetch(`/api/pet/${id}`, {
        method: 'DELETE'
    })
    .then(response => response.json())
    .then(data => {
        alert('Pet deleted successfully');
        location.reload();
    })
    .catch(error => console.error('Error:', error));
}
