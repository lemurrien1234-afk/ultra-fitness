/*
   TRAINERS LIST демо данные + генерация карточек
 */

const trainersData = [
    {
        id: 1,
        name: "Анна Гордеева",
        role: "Инструктор йоги / пилатеса",
        photo: "https://randomuser.me/api/portraits/women/44.jpg",
        experience: "5 лет",
        about: "Специалист по гибкости, дыхательным техникам и оздоровительным программам.",
        specialties: ["Йога", "Пилатес", "Стретчинг"]
    },
    {
        id: 2,
        name: "Алексей Ковалёв",
        role: "Инструктор кардио и HIIT",
        photo: "https://randomuser.me/api/portraits/men/46.jpg",
        experience: "7 лет",
        about: "Помогаю клиентам развить выносливость и улучшить сердечно-сосудистую систему.",
        specialties: ["Кардио", "HIIT", "Силовая выносливость"]
    },
    {
        id: 3,
        name: "Иван Иванов",
        role: "Персональный тренер",
        photo: "https://randomuser.me/api/portraits/men/12.jpg",
        experience: "6 лет",
        about: "Составляю индивидуальные планы тренировок для любых целей: похудение, набор массы, тонус.",
        specialties: ["Функциональный тренинг", "Силовые тренировки"]
    },
    {
        id: 4,
        name: "Елена Смирнова",
        role: "Групповые программы и растяжка",
        photo: "https://randomuser.me/api/portraits/women/68.jpg",
        experience: "8 лет",
        about: "Специалист по работе с группами, женскими тренировками и здоровой мобильностью.",
        specialties: ["Стретчинг", "Групповые тренировки"]
    },
    {
        id: 5,
        name: "Дмитрий Сергеев",
        role: "Инструктор тренажёрного зала",
        photo: "https://randomuser.me/api/portraits/men/79.jpg",
        experience: "10 лет",
        about: "Профессионал силового тренинга. Сертифицированный инструктор.",
        specialties: ["Тренажёрный зал", "Силовые тренировки"]
    },
    {
        id: 6,
        name: "Павел Морозов",
        role: "Тренер по единоборствам",
        photo: "https://randomuser.me/api/portraits/men/33.jpg",
        experience: "9 лет",
        about: "Провожу тренировки по боксу, ММА и самообороне.",
        specialties: ["Бокс", "ММА", "Единоборства"]
    }
];

/* 
   РЕНДЕР СПИСКА НА trainers.html
 */

const trainersContainer = document.getElementById("trainers-container");

if (trainersContainer) {
    trainersData.forEach(tr => {
        trainersContainer.innerHTML += `
            <div class="trainer-card fade-up">
                <img src="${tr.photo}" alt="${tr.name}">
                <h3>${tr.name}</h3>
                <p class="role">${tr.role}</p>
                <p class="exp">Опыт: ${tr.experience}</p>

                <a href="trainer-profile.html?id=${tr.id}"
                   class="btn-orange">
                    Подробнее
                </a>
            </div>
        `;
    });
}


