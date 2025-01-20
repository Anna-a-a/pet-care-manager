document.addEventListener('DOMContentLoaded', function() {
    const petOwnersContainer = document.getElementById('pet-owners');
    const petOwnersCards = document.getElementById('petOwnersCards');
    const searchPetOwners = document.getElementById('searchPetOwners');

    if (!petOwnersContainer || !petOwnersCards || !searchPetOwners) {
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
                    `;
                    petOwnersCards.appendChild(ownerCard);
                });
                petOwnersContainer.style.display = 'block'; // Отображение контейнера
            })
            .catch(error => console.error('Ошибка загрузки владельцев животных:', error));
    }

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
