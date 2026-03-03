// js/global.js
(function () {
  "use strict";

  const qs = (s, r = document) => r.querySelector(s);
  const qsa = (s, r = document) => Array.from(r.querySelectorAll(s));

  function lockScroll() {
    document.body.style.overflow = "hidden";
  }
  function unlockScroll() {
    document.body.style.overflow = "";
  }

  function closeAllPopups() {
    qsa(".popup").forEach(p => {
      p.style.display = "none";
      p.classList.remove("popup-visible");
    });
    unlockScroll();
  }

  function openPopup(id) {
    qsa(".popup").forEach(p => {
      p.style.display = "none";
      p.classList.remove("popup-visible");
    });

    const popup = qs(id);
    if (!popup) return;

    popup.style.display = "flex";
    popup.classList.add("popup-visible");
    lockScroll();
  }

  window.openPopup = openPopup;
  window.closeAllPopups = closeAllPopups;

  document.addEventListener("DOMContentLoaded", () => {
    /* MOBILE MENU */
    const burger = qs("#burger");
    const mobileMenu = qs("#mobileMenu");
    if (burger && mobileMenu) {
      burger.addEventListener("click", () => {
        mobileMenu.classList.toggle("active");
        burger.classList.toggle("burger-open");
      });
    }

    /* POPUPS */
    const popups = qsa(".popup");
    const openPopupLinks = qsa(".open-popup");
    const closeButtons = qsa(".popup-close");

    openPopupLinks.forEach(link => {
      link.addEventListener("click", e => {
        const target = link.getAttribute("href");
        if (target && target.startsWith("#")) {
          e.preventDefault();
          openPopup(target);
        }
      });
    });

    closeButtons.forEach(btn => btn.addEventListener("click", closeAllPopups));

    popups.forEach(popup => {
      popup.addEventListener("click", e => {
        if (e.target === popup) closeAllPopups();
      });
    });

    document.addEventListener("keydown", e => {
      if (e.key === "Escape") closeAllPopups();
    });

    if (sessionStorage.getItem("openLoginOnBack") === "true") {
      sessionStorage.removeItem("openLoginOnBack");
      setTimeout(() => openPopup("#popup-login"), 50);
    }

    /* LOGO → SCROLL TO TOP */
    const scrollTopBtn = qs("#scrollTopBtn");
    if (scrollTopBtn) {
      scrollTopBtn.addEventListener("click", e => {
        e.preventDefault();
        window.scrollTo({ top: 0, behavior: "smooth" });
      });
    }

    /* TRIAL FORM → SUCCESS POPUP */
    const trialForm = qs(".trial-form");
    if (trialForm) {
      trialForm.addEventListener("submit", e => {
        e.preventDefault();
        const fields = qsa("input, select", trialForm);
        for (const f of fields) {
          if (!String(f.value || "").trim()) return;
        }
        openPopup("#popup-success");
        trialForm.reset();
      });
    }

    /* SCROLL ANIMATIONS */
    const scrollElements = qsa(
      ".fade-up, .fade-left, .fade-right, .scale-in, .direction-card, .adv-card, .price-card"
    );

    function elementInView(el, offset = 120) {
      return el.getBoundingClientRect().top <= (window.innerHeight - offset);
    }

    function handleScrollAnimation() {
      scrollElements.forEach(el => {
        if (elementInView(el)) el.classList.add("visible");
      });
    }

    window.addEventListener("scroll", handleScrollAnimation);
    window.addEventListener("load", handleScrollAnimation);
    handleScrollAnimation();

    /* CURSOR TRAIL */
    document.addEventListener("mousemove", (e) => {
      const trail = document.createElement("div");
      trail.className = "trail";
      trail.style.left = `${e.clientX}px`;
      trail.style.top = `${e.clientY}px`;
      document.body.appendChild(trail);
      setTimeout(() => trail.remove(), 400);
    });

    /* PHONE MASK */
    qsa('input[type="tel"]').forEach(input => {
      function maskPhone(ev) {
        let value = String(ev.target.value || "").replace(/\D/g, "");
        if (!value.startsWith("7")) value = "7" + value;

        let result = "+7";
        if (value.length > 1) result += " (" + value.substring(1, 4);
        if (value.length >= 5) result += ") " + value.substring(4, 7);
        if (value.length >= 8) result += "-" + value.substring(7, 9);
        if (value.length >= 10) result += "-" + value.substring(9, 11);

        ev.target.value = result;
      }

      input.addEventListener("input", maskPhone);
      input.addEventListener("focus", maskPhone);
      input.addEventListener("blur", maskPhone);
    });

    /* SCROLL TO TOP ON RELOAD */
    if ("scrollRestoration" in window.history) {
      window.history.scrollRestoration = "manual";
    }
    window.addEventListener("load", () => window.scrollTo(0, 0));

    /* ===== USER MENU (FIXED IDS + SHOW/HIDE) ===== */
    const userMenuBlock = document.getElementById("userMenuBlock");
    const userNameSmall = document.getElementById("userNameSmall");
    const userDropdown = document.getElementById("userDropdown");
    const logoutBtn = document.getElementById("logoutBtn");
    const loginBtn = document.querySelector(".header-login-btn");

    let user = null;
    try {
      user = JSON.parse(localStorage.getItem("userData") || "null");
    } catch {}

    if (user && user.name) {
      userMenuBlock?.classList.remove("hidden");
      if (userNameSmall) userNameSmall.textContent = user.name;
      if (loginBtn) loginBtn.style.display = "none";
    } else {
      userMenuBlock?.classList.add("hidden");
      if (loginBtn) loginBtn.style.display = "";
    }

    if (userMenuBlock && userDropdown) {
      userMenuBlock.addEventListener("click", (e) => {
        e.stopPropagation();
        userDropdown.classList.toggle("hidden");
      });

      document.addEventListener("click", () => {
        userDropdown.classList.add("hidden");
      });
    }

    if (logoutBtn) {
      logoutBtn.addEventListener("click", (e) => {
        e.preventDefault();
        localStorage.removeItem("token");
        localStorage.removeItem("userData");
        window.location.href = "index.html";
      });
    }
    // ===== Swiper: Gallery (index) =====
const gallery = document.querySelector(".gallery-slider");
if (gallery && window.Swiper) {
  new Swiper(gallery, {
    loop: true,
    spaceBetween: 24,
    slidesPerView: 3,
    navigation: {
      nextEl: ".swiper-button-next",
      prevEl: ".swiper-button-prev",
    },
    pagination: {
      el: ".swiper-pagination",
      clickable: true,
    },
    breakpoints: {
      0: { slidesPerView: 1 },
      700: { slidesPerView: 2 },
      1024: { slidesPerView: 3 },
    },
  });
}
  });
})();