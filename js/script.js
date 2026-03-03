// js/script.js
(function () {
  "use strict";

  document.addEventListener("DOMContentLoaded", () => {
    // SWIPER GALLERY (index)
    const galleryEl = document.querySelector(".gallery-slider");
    if (galleryEl && window.Swiper) {
      new Swiper(galleryEl, {
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