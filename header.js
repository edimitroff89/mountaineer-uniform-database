const isGitHubPages =
    window.location.hostname.endsWith("github.io");

const SITE_ROOT = isGitHubPages
    ? "/mountaineer-uniform-database/"
    : "/";

const header = document.getElementById("siteHeader");

if (header) {
    header.innerHTML = `
        <a class="site-logo" href="${SITE_ROOT}index.html">
            <img
                src="${SITE_ROOT}Images/watermark.png"
                alt="Mountaineer Uniform Database"
            >
        </a>

        <nav class="main-nav">

            <a href="${SITE_ROOT}index.html">
                Home
            </a>

            <div class="nav-item">
                <a href="${SITE_ROOT}Football/database.html">
                    Football
                </a>

                <div class="mega-menu">
                    <div>
                        <h4>Football</h4>

                        <a href="${SITE_ROOT}Football/database.html">
                            Football Database
                        </a>

                        <a href="${SITE_ROOT}Football/season-overview.html">
                            Football Seasons
                        </a>

                        <a href="${SITE_ROOT}Builder/index.html">
                            Uniform Builder
                        </a>
                    </div>
                </div>
            </div>

            <div class="nav-item">
                <a href="${SITE_ROOT}Basketball/seasons.html">
                    Basketball
                </a>

                <div class="mega-menu">
                    <div>
                        <h4>Basketball</h4>

                        <a href="${SITE_ROOT}Basketball/seasons.html">
                            Men's Basketball Seasons
                        </a>

                        <a href="${SITE_ROOT}Basketball/womens-seasons.html">
                            Women's Basketball Seasons
                        </a>
                    </div>
                </div>
            </div>

            <div class="nav-item">
                <a href="${SITE_ROOT}Baseball/seasons.html">
                    Baseball
                </a>

                <div class="mega-menu">
                    <div>
                        <h4>Baseball</h4>

                        <a href="${SITE_ROOT}Baseball/seasons.html">
                            Baseball Season Overviews
                        </a>
                    </div>
                </div>
            </div>

            <div class="nav-item">
                <a href="${SITE_ROOT}Playing%20Surfaces/mountaineer-field-designs.html">
                    Playing Surfaces
                </a>

                <div class="mega-menu">
                    <div>
                        <h4>Playing Surfaces</h4>

                        <a href="${SITE_ROOT}Playing%20Surfaces/mountaineer-field-designs.html">
                            Mountaineer Field Designs
                        </a>

                        <a href="${SITE_ROOT}Playing%20Surfaces/coliseum-floor-designs.html">
                            WVU Coliseum Floors
                        </a>

                        <a href="${SITE_ROOT}Playing%20Surfaces/bowl-game-field-designs.html">
                            Bowl Game Fields
                        </a>
                    </div>
                </div>
            </div>

            <a href="${SITE_ROOT}about.html">
                About
            </a>

        </nav>
    `;
}

const siteHeader = document.getElementById("siteHeader");

if (siteHeader) {
    window.addEventListener("scroll", () => {
        if (window.scrollY > 80) {
            siteHeader.classList.add("shrink");
        } else {
            siteHeader.classList.remove("shrink");
        }
    });
}
// Mobile navigation dropdowns
document.querySelectorAll(".nav-item > a").forEach(link => {
    link.addEventListener("click", function (event) {

        // Only use tap-to-open behavior on mobile
        if (window.innerWidth <= 850) {
            const navItem = this.parentElement;
            const isOpen = navItem.classList.contains("open");

            // If menu is closed, first tap opens it
            if (!isOpen) {
                event.preventDefault();

                // Close any other open dropdown
                document.querySelectorAll(".nav-item.open").forEach(item => {
                    item.classList.remove("open");
                });

                navItem.classList.add("open");
            }
        }
    });
});

// Close mobile dropdown when tapping elsewhere
document.addEventListener("click", function (event) {
    if (
        window.innerWidth <= 850 &&
        !event.target.closest(".nav-item")
    ) {
        document.querySelectorAll(".nav-item.open").forEach(item => {
            item.classList.remove("open");
        });
    }
});