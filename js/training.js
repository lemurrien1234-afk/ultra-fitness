/* АНИМАЦИЯ КАРТОЧЕК  */
const cards = document.querySelectorAll(".training-card");

function animateCards() {
    cards.forEach((card, i) => {
        if (card.getBoundingClientRect().top < window.innerHeight - 80) {
            setTimeout(() => {
                card.classList.add("visible");
            }, i * 120); // задержка между карточками
        }
    });
}

window.addEventListener("scroll", animateCards);
window.addEventListener("load", animateCards);


/* МОДАЛКИ  */
const infoButtons = document.querySelectorAll(".training-info-btn");

infoButtons.forEach(btn => {
    btn.addEventListener("click", () => {
        const card = btn.closest(".training-card");
        const modalId = card.dataset.modal;
        const modal = document.getElementById("modal-" + modalId);
        if (modal) modal.style.display = "flex";
    });
});

const modals = document.querySelectorAll(".modal-bg");
modals.forEach(modal => {
    modal.addEventListener("click", e => {
        if (e.target === modal || e.target.classList.contains("modal-close")) {
            modal.style.display = "none";
        }
    });
});
