/* ========= CHAT ========= */
function openTrainerChat() {
  const el = document.getElementById("trainerChat");
  if (el) el.style.display = "flex";
}

function closeTrainerChat() {
  const el = document.getElementById("trainerChat");
  if (el) el.style.display = "none";
}

/* ========= METRICS STORAGE ========= */
const METRICS_KEY = "uf_metrics_v1";

function loadMetrics() {
  try {
    const raw = localStorage.getItem(METRICS_KEY);
    const data = raw ? JSON.parse(raw) : [];
    return Array.isArray(data) ? data : [];
  } catch (e) {
    return [];
  }
}

function saveMetrics(list) {
  localStorage.setItem(METRICS_KEY, JSON.stringify(list));
}

function calcBMI(weightKg, heightCm) {
  const h = Number(heightCm) / 100;
  if (!h) return null;
  return Number(weightKg) / (h * h);
}

function fmt(n, d = 1) {
  if (n === null || Number.isNaN(n) || n === undefined) return "—";
  return Number(n).toFixed(d);
}

let progressChart = null;

function renderProgressChart() {
  const canvas = document.getElementById("progressChart");
  if (!canvas) return;

  if (typeof Chart === "undefined") {
    // Chart.js не подключился — просто ничего не рисуем
    return;
  }

  const metrics = loadMetrics().sort((a, b) => (a.date || "").localeCompare(b.date || ""));
  const labels = metrics.map(m => m.date);
  const weights = metrics.map(m => m.weight);
  const bmis = metrics.map(m => {
    const v = calcBMI(m.weight, m.height);
    return v ? Number(v.toFixed(1)) : null;
  });

  const ctx = canvas.getContext("2d");

  if (progressChart) {
    progressChart.destroy();
    progressChart = null;
  }

  progressChart = new Chart(ctx, {
    type: "line",
    data: {
      labels,
      datasets: [
        { label: "Вес (кг)", data: weights, tension: 0.3 },
        { label: "ИМТ", data: bmis, tension: 0.3 },
      ]
    },
    options: {
      responsive: true,
      plugins: {
        legend: { display: true }
      },
      scales: {
        x: { ticks: { color: "#aaa" }, grid: { color: "rgba(255,255,255,0.06)" } },
        y: { ticks: { color: "#aaa" }, grid: { color: "rgba(255,255,255,0.06)" } },
      }
    }
  });
}

function renderBodyStatsHTML() {
  const metrics = loadMetrics().sort((a, b) => (a.date || "").localeCompare(b.date || ""));
  const last = metrics[metrics.length - 1];

  const weight = last?.weight ?? null;
  const height = last?.height ?? null;
  const bmi = (weight && height) ? calcBMI(weight, height) : null;

  // Твои же p-строки, но с реальными данными
  return `
    <h2>Показатели тела</h2>
    <p>Рост: ${height ? `${fmt(height, 0)}` : "—"} см</p>
    <p>Вес: ${weight ? `${fmt(weight, 1)}` : "—"} кг</p>
    <p>ИМТ: ${bmi ? fmt(bmi, 1) : "—"}</p>

    <hr style="border:0;border-top:1px solid #222;margin:14px 0;">

    <h3 style="margin-bottom:10px;">Добавить замер</h3>

    <form id="metricsForm" style="display:flex;flex-wrap:wrap;gap:10px;align-items:end;">
      <div style="flex:1;min-width:160px;">
        <label style="display:block;font-size:13px;color:#aaa;margin-bottom:6px;">Дата</label>
        <input id="mDate" type="date" required
          style="width:100%;padding:12px;background:#000;border:1px solid #222;border-radius:10px;color:#fff;">
      </div>

      <div style="flex:1;min-width:160px;">
        <label style="display:block;font-size:13px;color:#aaa;margin-bottom:6px;">Вес (кг)</label>
        <input id="mWeight" type="number" step="0.1" min="20" max="300" required
          style="width:100%;padding:12px;background:#000;border:1px solid #222;border-radius:10px;color:#fff;">
      </div>

      <div style="flex:1;min-width:160px;">
        <label style="display:block;font-size:13px;color:#aaa;margin-bottom:6px;">Рост (см)</label>
        <input id="mHeight" type="number" step="1" min="120" max="230" required
          style="width:100%;padding:12px;background:#000;border:1px solid #222;border-radius:10px;color:#fff;">
      </div>

      <button class="btn-orange" type="submit" style="height:44px;">Сохранить</button>
    </form>

    <p style="color:#aaa;margin-top:10px;font-size:13px;">
      Замеры сохраняются в браузере (localStorage). Всего записей: <b style="color:#ff7a00">${metrics.length}</b>
    </p>
  `;
}

/* ========= MAIN ========= */
document.addEventListener("DOMContentLoaded", () => {
  // 1) Имя пользователя (у тебя в HTML id="clientName")
  const user = JSON.parse(localStorage.getItem("userData") || "null");
  const nameEl =
    document.getElementById("clientName") ||
    document.getElementById("profileName");

  if (user?.name && nameEl) {
    nameEl.textContent = user.name;
  }

  // 2) карточки (и .dashboard-card, и .dash-card) — чтобы не конфликтовали
  const cards = document.querySelectorAll(".dashboard-card, .dash-card");
  const content = document.getElementById("dashboardContent");
  if (!cards.length || !content) return;

  // 3) templates (сохраняем твою концепцию)
  const templates = {
    body: () => renderBodyStatsHTML(),
    progress: () => `
      <h2>Прогресс</h2>
      <p style="color:#aaa;margin-bottom:10px;">График веса и ИМТ по замерам</p>

      <div style="background:#0b0b0b;border:1px solid rgba(255,122,0,.15);border-radius:16px;padding:14px;">
        <canvas id="progressChart" height="120"></canvas>
      </div>

      <div style="display:flex;gap:10px;flex-wrap:wrap;margin-top:12px;">
        <button id="seedDemo" class="btn-orange" type="button">Демо-данные</button>
        <button id="clearMetrics" class="btn-orange" type="button" style="background:#222;color:#fff;">Очистить</button>
      </div>
    `,
    activity: () => `
      <h2>Активность</h2>
      <p>✅ Посещений за месяц: 12</p>
    `,
    favorites: () => `<h2>Избранное</h2><p>Пока пусто</p>`,
    upcoming: () => `<h2>Ближайшие тренировки</h2><p>Нет записей</p>`,
    history: () => `<h2>История</h2><p>Нет данных</p>`
  };

  function openTab(tab) {
    // активная карточка
    cards.forEach(c => c.classList.toggle("active", c.dataset.tab === tab));

    // контент
    const tpl = templates[tab];
    content.innerHTML = typeof tpl === "function" ? tpl() : "Нет данных";

    // спец-логика для вкладок
    if (tab === "body") {
      const dateInput = document.getElementById("mDate");
      if (dateInput && !dateInput.value) {
        const d = new Date();
        const pad = (x) => String(x).padStart(2, "0");
        dateInput.value = `${d.getFullYear()}-${pad(d.getMonth() + 1)}-${pad(d.getDate())}`;
      }

      const form = document.getElementById("metricsForm");
      form?.addEventListener("submit", (e) => {
        e.preventDefault();

        const date = document.getElementById("mDate")?.value;
        const weight = Number(document.getElementById("mWeight")?.value);
        const height = Number(document.getElementById("mHeight")?.value);

        if (!date || !weight || !height) return;

        const list = loadMetrics();
        const idx = list.findIndex(x => x.date === date);
        const item = { date, weight, height };

        if (idx >= 0) list[idx] = item;
        else list.push(item);

        saveMetrics(list);

        // сразу покажем прогресс
        openTab("progress");
      });
    }

    if (tab === "progress") {
      // кнопки демо/очистки
      document.getElementById("seedDemo")?.addEventListener("click", () => {
        const demo = [
          { date: "2025-10-01", weight: 86.2, height: 176 },
          { date: "2025-11-01", weight: 84.7, height: 176 },
          { date: "2025-12-01", weight: 82.9, height: 176 },
          { date: "2026-01-01", weight: 81.6, height: 176 },
          { date: "2026-02-01", weight: 80.8, height: 176 },
        ];
        saveMetrics(demo);
        openTab("progress");
      });

      document.getElementById("clearMetrics")?.addEventListener("click", () => {
        saveMetrics([]);
        openTab("progress");
      });

      // рисуем график
      renderProgressChart();
    }
  }

  // 4) навешиваем обработчики на карточки
  cards.forEach(card => {
    card.addEventListener("click", () => {
      const tab = card.dataset.tab;
      openTab(tab);
    });
  });

  // 5) открыть первую вкладку как у тебя было
  openTab(cards[0].dataset.tab || "body");
});
