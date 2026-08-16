function getBasePath() {
    const path = window.location.pathname;
    const isInFolder = path.split("/").length > 2;
    return isInFolder ? "../" : "";
}

const base = getBasePath();

document.getElementById("siteHeader").innerHTML = `
    <a class="site-logo" href="${base}index.html">
        <img src="${base}Images/watermark.png" alt="Mountaineer Uniform Database">
    </a>

    <nav class="main-nav">
        <a href="${base}index.html">Home</a>

        <div class="nav-item">
            <a href="${base}Football/database.html">Football</a>
            <div class="mega-menu">
                <div>
                    <h4>Football</h4>
                    <a href="${base}Football/database.html">Football Database</a>
                    <a href="${base}Football/season-overview.html">Football Seasons</a>
                    <a href="${base}Builder/index.html">Uniform Builder</a>
                </div>
            </div>
        </div>

        <div class="nav-item">
            <a href="${base}Basketball/seasons.html">Basketball</a>
            <div class="mega-menu">
                <div>
                    <h4>Basketball</h4>
                    <a href="${base}Basketball/seasons.html">Men's Basketball Seasons</a>
                    <a href="${base}Basketball/womens-seasons.html">Women's Basketball Seasons</a>
                </div>
            </div>
        </div>

        <div class="nav-item">
            <a href="${base}Baseball/seasons.html">Baseball</a>
            <div class="mega-menu">
                <div>
                    <h4>Baseball</h4>
                    <a href="${base}Baseball/seasons.html">Baseball Season Overviews</a>
                </div>
            </div>
        </div>

        <div class="nav-item">
            <a href="#">Playing Surfaces</a>
            <div class="mega-menu">
                <div>
                    <h4>Playing Surfaces</h4>
                    <a href="${base}Playing Surfaces/mountaineer-field-designs.html"">Mountaineer Field Designs</a>
                    <a href="${base}Playing Surfaces/coliseum-floor-designs.html"">WVU Coliseum Floors</a>
                    <a href="${base}Playing Surfaces/bowl-game-field-designs.html">Bowl Game Fields</a>
                </div>
            </div>
        </div>

        <a href="${base}about.html">About</a>
    </nav>
`;

const siteHeader = document.getElementById("siteHeader");

window.addEventListener("scroll", () => {
    if (window.scrollY > 80) {
        siteHeader.classList.add("shrink");
    } else {
        siteHeader.classList.remove("shrink");
    }
});