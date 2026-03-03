// js/schedule.js
(function () {
  "use strict";

  /*  ДАННЫЕ */
  const scheduleData = [
    { id: 1, time: "08:00", name: "Йога", trainer: "Ирина", trainerId: 1, hall: "Зал 1", type: "Стретчинг", day: "Понедельник" },
    { id: 2, time: "09:00", name: "Кардио Mix", trainer: "Ольга", trainerId: 2, hall: "Зал 3", type: "Кардио", day: "Понедельник" },
    { id: 3, time: "10:00", name: "Функциональный тренинг", trainer: "Ольга", trainerId: 3, hall: "Зал 2", type: "Функциональный тренинг", day: "Понедельник" },
    { id: 4, time: "11:00", name: "Групповая тренировка", trainer: "Анна", trainerId: 4, hall: "Зал 1", type: "Групповая тренировка", day: "Понедельник" },
    { id: 5, time: "12:00", name: "Йога", trainer: "Ирина", trainerId: 1, hall: "Зал 2", type: "Стретчинг", day: "Понедельник" },
    { id: 6, time: "14:00", name: "Тренажёрный зал", trainer: "Александр", trainerId: 5, hall: "Зал 5", type: "Тренажерный зал", day: "Понедельник" },
    { id: 7, time: "16:00", name: "Бокс", trainer: "Андрей", trainerId: 6, hall: "Зал 4", type: "Единоборства", day: "Понедельник" },
    { id: 8, time: "18:00", name: "HIIT", trainer: "Денис", trainerId: 2, hall: "Зал 3", type: "HIIT", day: "Понедельник" },
    { id: 9, time: "19:00", name: "Кардио-интервалы", trainer: "Ольга", trainerId: 3, hall: "Зал 3", type: "Кардио", day: "Понедельник" },
    { id: 10, time: "20:00", name: "Растяжка", trainer: "Ирина", trainerId: 4, hall: "Зал 1", type: "Стретчинг", day: "Понедельник" }
  ];

  /* ЭЛЕМЕНТЫ */
  const scheduleBody = document.getElementById("schedule-body");
  if (!scheduleBody) return;

  const filterType = document.getElementById("filter-type");
  const filterTrainer = document.getElementById("filter-trainer");
  const filterDay = document.getElementById("filter-day");
  const dayButtons = document.querySelectorAll(".day-btn");

  let selectedDay = "Понедельник";

  function val(el) {
    return el ? String(el.value || "") : "";
  }

  /* РЕНДЕР */
  function renderSchedule() {
    scheduleBody.innerHTML = "";

    const typeV = val(filterType);
    const trainerV = val(filterTrainer);
    const dayV = val(filterDay);

    const filtered = scheduleData.filter(item => (
      (typeV === "" || typeV === item.type) &&
      (trainerV === "" || trainerV === item.trainer) &&
      (dayV === "" || dayV === item.day) &&
      (selectedDay === "all" || item.day === selectedDay)
    ));

    if (filtered.length === 0) {
      scheduleBody.innerHTML = `
        <tr>
          <td colspan="5" style="text-align: center; color: #777; padding: 18px;">
            Нет тренировок по выбранным фильтрам
          </td>
        </tr>
      `;
      return;
    }

    const rows = filtered.map(item => `
      <tr>
        <td>${item.time}</td>
        <td>${item.name}</td>

        <td>
          <a href="trainer-profile.html?id=${item.trainerId}" class="trainer-link">
            ${item.trainer}
          </a>
        </td>

        <td>${item.hall}</td>

        <td>
          <button
            class="btn-orange sign-btn"
            data-id="${item.id}"
            data-name="${item.name}">
            Записаться
          </button>
        </td>
      </tr>
    `).join("");

    scheduleBody.innerHTML = rows;
  }

  /* 🔥 КЛИК ПО ЗАПИСИ (ИСПРАВЛЕНО) */
  scheduleBody.addEventListener("click", async (e) => {
    const btn = e.target.closest(".sign-btn");
    if (!btn) return;

    const token = localStorage.getItem("token");
    if (!token) {
      alert("Сначала войдите в аккаунт");
      return;
    }

    const trainingId = Number(btn.dataset.id);
    if (!trainingId) {
      alert("Ошибка определения тренировки");
      return;
    }

    try {
      const res = await fetch("http://localhost:5000/api/bookings", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: "Bearer " + token
        },
        body: JSON.stringify({ trainingId })
      });

      const data = await res.json().catch(() => ({}));

      if (!res.ok) {
        alert(data.message || "Ошибка записи");
        return;
      }

      const titleEl = document.getElementById("popup-training-name");
      if (titleEl) titleEl.innerText = btn.dataset.name || "";

      if (typeof window.openPopup === "function") {
        window.openPopup("#popup-success");
      } else {
        alert("Вы успешно записаны!");
      }

    } catch (err) {
      console.error(err);
      alert("Сервер недоступен");
    }
  });

  /* КАЛЕНДАРЬ */
  dayButtons.forEach(btn => {
    btn.addEventListener("click", () => {
      dayButtons.forEach(b => b.classList.remove("active"));
      btn.classList.add("active");

      selectedDay = btn.dataset.day || "all";

      if (filterDay) {
        filterDay.value = (selectedDay === "all") ? "" : selectedDay;
      }

      renderSchedule();
    });
  });

  if (filterDay) {
    filterDay.addEventListener("change", () => {
      selectedDay = filterDay.value || "all";

      dayButtons.forEach(btn => {
        const active =
          (selectedDay === "all" && btn.dataset.day === "all") ||
          (btn.dataset.day === selectedDay);

        btn.classList.toggle("active", active);
      });

      renderSchedule();
    });
  }

  filterType?.addEventListener("change", renderSchedule);
  filterTrainer?.addEventListener("change", renderSchedule);

  renderSchedule();
})();
