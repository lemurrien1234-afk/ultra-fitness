/* 
   TRAINER PROFILE — подгрузка данных по ID
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
        about: "Составляю индивидуальные планы тренировок для любых целей.",
        specialties: ["Функциональный тренинг", "Силовые тренировки"]
    },
    {
        id: 4,
        name: "Елена Смирнова",
        role: "Групповые программы и растяжка",
        photo: "https://randomuser.me/api/portraits/women/68.jpg",
        experience: "8 лет",
        about: "Специалист по работе с группами и здоровой мобильности.",
        specialties: ["Стретчинг", "Групповые тренировки"]
    },
    {
        id: 5,
        name: "Дмитрий Сергеев",
        role: "Инструктор тренажёрного зала",
        photo: "https://randomuser.me/api/portraits/men/79.jpg",
        experience: "10 лет",
        about: "Профессионал силового тренинга.",
        specialties: ["Тренажёрный зал", "Силовые тренировки"]
    },
    {
        id: 6,
        name: "Павел Морозов",
        role: "Тренер по единоборствам",
        photo: "https://randomuser.me/api/portraits/men/33.jpg",
        experience: "9 лет",
        about: "Бокс, ММА, самооборона.",
        specialties: ["Бокс", "ММА", "Единоборства"]
    }
];

/*  ПОЛУЧАЕМ ID ИЗ URL */

const params = new URLSearchParams(window.location.search);
const trainerId = Number(params.get("id"));

const trainer = trainersData.find(t => t.id === trainerId);

const content = document.getElementById("trainer-content");

/*  РЕНДЕР ПРОФИЛЯ  */
if (trainer && content) {
    content.innerHTML = `
        <div class="trainer-profile-wrapper fade-up">

            <div class="trainer-photo">
                <img src="${trainer.photo}" alt="${trainer.name}">
            </div>

            <div class="trainer-info">
                <h1>${trainer.name}</h1>
                <h3>${trainer.role}</h3>

                <p class="exp">Опыт: ${trainer.experience}</p>
                <p class="about">${trainer.about}</p>

                <h4>Направления:</h4>
                <ul class="spec-list">
                    ${trainer.specialties.map(s => `<li>${s}</li>`).join("")}
                </ul>

                <a href="schedule.html" class="btn-orange big-btn">
                    Смотреть расписание
                </a>
            </div>

        </div>
    `;
} else {
    content.innerHTML = `
        <p style="color: #ccc; text-align:center; margin-top:40px;">
            Тренер не найден
        </p>
    `;
}
