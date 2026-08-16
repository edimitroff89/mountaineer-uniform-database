const siteHeader = document.getElementById("siteHeader");

window.addEventListener("scroll", () => {
    if (window.scrollY > 80) {
        siteHeader.classList.add("shrink");
    } else {
        siteHeader.classList.remove("shrink");
    }
});