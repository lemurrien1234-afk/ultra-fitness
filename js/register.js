// js/register.js
(function () {
  "use strict";

  const API_URL = "http://localhost:5000/api/auth/register";

  const step1 = document.getElementById("step1");
  const step2 = document.getElementById("step2");
  const step3 = document.getElementById("step3");

  // если не register.html — выходим
  if (!step1 || !step2 || !step3) return;

  const toStep2Btn = document.getElementById("toStep2Btn");
  const sendCodeBtn = document.getElementById("sendCodeBtn");
  const resendBtn = document.getElementById("resendBtn");
  const toStep3Btn = document.getElementById("toStep3Btn");
  const finishBtn = document.getElementById("finishBtn");

  const confirmCodeInput = document.getElementById("confirmCode");
  const errorMessage = document.getElementById("errorMessage");
  const passError = document.getElementById("passError");

  const regName = document.getElementById("regName");
  const regPhone = document.getElementById("regPhone");
  const regEmail = document.getElementById("regEmail");
  const pass1 = document.getElementById("regPass1");
  const pass2 = document.getElementById("regPass2");

  let generatedCode = null;
  let timer = 60;
  let interval = null;

  // ===============================
  // 📱 НОРМАЛИЗАЦИЯ ТЕЛЕФОНА
  // ===============================
  function normalizePhone(phone) {
    let digits = phone.replace(/\D/g, "");

    // если ввели 10 цифр — считаем российский без 7
    if (digits.length === 10) {
      digits = "7" + digits;
    }

    if (digits.length !== 11) return null;

    return "+7" + digits.slice(1);
  }

  // ===============================
  // ✅ ПРОВЕРКА ШАГА 1
  // ===============================
  function checkStep1Fields() {
    const nameValid = /^[А-Яа-яЁё\s-]{5,}$/.test(regName.value.trim());
    const emailValid = /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(regEmail.value.trim());

    const normalizedPhone = normalizePhone(regPhone.value);
    const phoneValid = normalizedPhone !== null;

    document.getElementById("nameError")?.remove();
    document.getElementById("emailError")?.remove();
    document.getElementById("phoneError")?.remove();

    if (!nameValid && regName.value !== "") {
      regName.insertAdjacentHTML(
        "afterend",
        `<p id="nameError" class="error-field">Введите корректное ФИО</p>`
      );
    }

    if (!phoneValid && regPhone.value !== "") {
      regPhone.insertAdjacentHTML(
        "afterend",
        `<p id="phoneError" class="error-field">Введите корректный номер (11 цифр)</p>`
      );
    }

    if (!emailValid && regEmail.value !== "") {
      regEmail.insertAdjacentHTML(
        "afterend",
        `<p id="emailError" class="error-field">Некорректный email</p>`
      );
    }

    toStep2Btn.disabled = !(nameValid && phoneValid && emailValid);
  }

  regName.addEventListener("input", checkStep1Fields);
  regPhone.addEventListener("input", checkStep1Fields);
  regEmail.addEventListener("input", checkStep1Fields);
  checkStep1Fields();

  // ===============================
  // 📲 ОТПРАВКА КОДА (пока демо)
  // ===============================
sendCodeBtn.addEventListener("click", async () => {
  const phone = regPhone.value.trim();

  try {
    const res = await fetch("http://localhost:5000/api/verify/send-code", {
      method: "POST",
      headers: {
        "Content-Type": "application/json"
      },
      body: JSON.stringify({ phone })
    });

    const data = await res.json().catch(() => ({}));

    if (!res.ok) {
      alert(data.message || "Ошибка отправки кода");
      return;
    }

    sendCodeBtn.disabled = true;
    startTimer();

  } catch (e) {
    alert("Сервер недоступен");
  }
});

  function startTimer() {
    timer = 60;
    const timeLabel = document.getElementById("time");
    resendBtn.disabled = true;

    if (interval) clearInterval(interval);
    interval = setInterval(() => {
      timer--;
      if (timeLabel) timeLabel.textContent = String(timer);

      if (timer <= 0) {
        clearInterval(interval);
        interval = null;
        resendBtn.disabled = false;
      }
    }, 1000);
  }

  resendBtn.addEventListener("click", () => {
    generatedCode = String(Math.floor(1000 + Math.random() * 9000));
    console.log("НОВЫЙ SMS-код:", generatedCode);

    resendBtn.disabled = true;
    startTimer();
  });

  // ===============================
  // ➡️ ПЕРЕХОД К ШАГУ 2
  // ===============================
  toStep2Btn.addEventListener("click", () => {
    step1.classList.remove("active");
    step2.classList.add("active");
  });

  // ===============================
  // ✅ ПРОВЕРКА КОДА
  // ===============================
toStep3Btn.addEventListener("click", async () => {
  if (errorMessage) errorMessage.textContent = "";

  try {
    const res = await fetch("http://localhost:5000/api/verify/check-code", {
      method: "POST",
      headers: {
        "Content-Type": "application/json"
      },
      body: JSON.stringify({
        phone: regPhone.value.trim(),
        code: confirmCodeInput.value.trim()
      })
    });

    const data = await res.json().catch(() => ({}));

    if (!res.ok) {
      if (errorMessage) errorMessage.textContent = data.message || "Неверный код";
      confirmCodeInput.value = "";
      return;
    }

    step2.classList.remove("active");
    step3.classList.add("active");

  } catch (e) {
    alert("Сервер недоступен");
  }
});

  // ===============================
  // 🔐 ПЕРЕХОД К ЛОГИНУ
  // ===============================
  document.getElementById("goLogin")?.addEventListener("click", (e) => {
    e.preventDefault();
    sessionStorage.setItem("openLoginOnBack", "true");
    window.location.href = "index.html";
  });

  // ===============================
  // 🚀 ФИНАЛ РЕГИСТРАЦИИ
  // ===============================
  finishBtn.addEventListener("click", async () => {
    if (passError) passError.textContent = "";

    const name = regName.value.trim();
    const email = regEmail.value.trim();
    const password = pass1.value.trim();

    if (password.length < 5) {
      if (passError)
        passError.textContent = "Пароль должен быть не менее 5 символов";
      return;
    }

    if (pass1.value !== pass2.value) {
      if (passError) passError.textContent = "Пароли не совпадают";
      return;
    }

    try {
      const response = await fetch(API_URL, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ name, email, password })
      });

      const result = await response.json().catch(() => ({}));

      if (!response.ok) {
        alert(result.message || "Ошибка регистрации");
        return;
      }

      localStorage.setItem("token", result.token);
      localStorage.setItem("userData", JSON.stringify(result.user));

      window.location.href = "profile.html";
    } catch (e) {
      alert("Сервер недоступен. Проверь backend.");
    }
  });
})();
