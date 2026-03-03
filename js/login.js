// js/login.js
(function () {
  "use strict";

  const LOGIN_URL = "http://localhost:5000/api/auth/login";

  document.addEventListener("DOMContentLoaded", () => {
    const form = document.querySelector("#popup-login form");
    const btn = document.querySelector(".login-btn");

    // если есть форма — работаем через submit (надежнее)
    if (form) {
      form.addEventListener("submit", handleLogin);
    }

    // fallback если форма не используется
    if (btn) {
      btn.addEventListener("click", handleLogin);
    }
  });

  async function handleLogin(e) {
    e?.preventDefault?.();

    const email = document.querySelector("#popup-login input[type=email]")?.value.trim() || "";
    const password = document.querySelector("#popup-login input[type=password]")?.value.trim() || "";

    if (!email || !password) {
      alert("Введите email и пароль");
      return;
    }

    try {
      const response = await fetch("http://localhost:5000/api/auth/login", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email, password })
      });

      const result = await response.json().catch(() => ({}));

      if (!response.ok) {
        alert(result.message || "Ошибка входа");
        return;
      }

      // ✅ сохраняем токен
      localStorage.setItem("token", result.token);
      localStorage.setItem("userData", JSON.stringify(result.user));

      // ✅ переход в профиль
      window.location.href = "profile.html";

    } catch (e) {
      console.error(e);
      alert("Сервер недоступен. Проверь backend.");
    }
  }
})();