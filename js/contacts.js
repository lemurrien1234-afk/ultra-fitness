document.querySelectorAll(".contact-btn").forEach(btn => {
    btn.addEventListener("click", () => {
        document.getElementById("popup-person-name").innerText =
            "Написать — " + btn.dataset.name;

        document.getElementById("popup-contact").style.display = "flex";
    });
});

document.querySelectorAll(".popup-close").forEach(close => {
    close.addEventListener("click", () => {
        document.querySelectorAll(".popup").forEach(p => p.style.display = "none");
    });
});
