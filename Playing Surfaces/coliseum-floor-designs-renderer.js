const coliseumFloorContainer = document.getElementById(
    "coliseumFloorOverview"
);

renderAllColiseumFloors();

function renderAllColiseumFloors() {
    if (!coliseumFloorContainer) {
        return;
    }

    coliseumFloorContainer.innerHTML = "";

    const sortedFloors = [...COLISEUM_FLOOR_DESIGNS]
        .sort((a, b) => Number(b.season) - Number(a.season));

    sortedFloors.forEach(renderColiseumFloor);

    const params = new URLSearchParams(window.location.search);
    const requestedSeason = params.get("season");

    if (requestedSeason) {
        requestAnimationFrame(() => {
            document
                .getElementById(
                    `coliseum-floor-${seasonToId(requestedSeason)}`
                )
                ?.scrollIntoView({
                    behavior: "smooth",
                    block: "start"
                });
        });
    }
}

function renderColiseumFloor(floorData) {
    const seasonId = seasonToId(floorData.season);

    const floorHTML = `
        <section
            class="field-design-card"
            id="coliseum-floor-${seasonId}"
            data-season="${floorData.season}"
        >
            <div class="field-design-frame">
                <img
                    class="field-design-image"
                    src="../Images/Database/Playing Surfaces/${floorData.artwork}"
                    alt="${floorData.title}"
                    loading="lazy"
                >
            </div>

            <div class="field-design-info">
                <h2>${floorData.season}</h2>

                ${
                    floorData.title
                        ? `<h3>${floorData.title}</h3>`
                        : ""
                }

                ${
                    floorData.description
                        ? `<p>${floorData.description}</p>`
                        : ""
                }
            </div>
        </section>
    `;

    coliseumFloorContainer.insertAdjacentHTML(
        "beforeend",
        floorHTML
    );
}

function seasonToId(season) {
    return String(season).replace(/[^a-zA-Z0-9]/g, "-");
}