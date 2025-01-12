document.addEventListener('DOMContentLoaded', function() {
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

function showAddPetOwnerForm() {
    document.getElementById('pet-owner-form').style.display = 'block';
}

function showAddPetForm() {
    document.getElementById('pet-form').style.display = 'block';
}

document.getElementById('add-pet-owner-form').addEventListener('submit', function(event) {
    event.preventDefault();
    const formData = new FormData(event.target);
    const petOwner = {
        lastName: formData.get('last-name'),
        firstName: formData.get('first-name'),
        middleName: formData.get('middle-name'),
        inn: formData.get('inn')
    };

    fetch('/api/petOwner', {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json'
        },
        body: JSON.stringify(petOwner)
    })
    .then(response => response.json())
    .then(data => {
        alert('Pet Owner added successfully');
        location.reload();
    })
    .catch(error => console.error('Error:', error));
});

document.getElementById('add-pet-form').addEventListener('submit', function(event) {
    event.preventDefault();
    const formData = new FormData(event.target);
    const pet = {
        nickname: formData.get('nickname'),
        breed: formData.get('breed'),
        petSpecies: formData.get('pet-species'),
        ownerId: formData.get('owner-id'),
        passportNumber: formData.get('passport-number')
    };

    fetch('/api/pet', {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json'
        },
        body: JSON.stringify(pet)
    })
    .then(response => response.json())
    .then(data => {
        alert('Pet added successfully');
        location.reload();
    })
    .catch(error => console.error('Error:', error));
});


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
