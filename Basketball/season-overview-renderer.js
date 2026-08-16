const basketballSeasonContainer = document.getElementById(
    "basketballSeasonOverview"
);

renderAllBasketballSeasons();

function renderAllBasketballSeasons() {
    if (!basketballSeasonContainer) {
        return;
    }

    basketballSeasonContainer.innerHTML = "";

    const sortedSeasons = [...MBASKETBALL_SEASONS].sort((a, b) => {
        const firstYearA = Number(a.season.split("-")[0]);
        const firstYearB = Number(b.season.split("-")[0]);

        return firstYearB - firstYearA;
    });

    sortedSeasons.forEach(renderBasketballSeason);

    const params = new URLSearchParams(window.location.search);
    const requestedSeason = params.get("season");

    if (requestedSeason) {
        requestAnimationFrame(() => {
            document
                .getElementById(
                    `basketball-season-${seasonToId(requestedSeason)}`
                )
                ?.scrollIntoView({
                    behavior: "smooth",
                    block: "start"
                });
        });
    }
}

function renderBasketballSeason(seasonData) {
    const artwork = Array.isArray(seasonData.artwork)
        ? seasonData.artwork
        : [];

    const artworkHTML = artwork.length > 0
        ? `
            <div class="basketball-season-frame">
                <div class="basketball-season-grid">
                    ${artwork
                        .map(filename => renderBasketballArtwork(
                            filename,
                            seasonData.season
                        ))
                        .join("")}
                </div>
            </div>
        `
        : `
            <div class="basketball-season-frame">
                <p class="artwork-coming-soon">
                    Uniform artwork coming soon.
                </p>
            </div>
        `;

    const seasonHTML = `
        <section
            class="basketball-season-card"
            id="basketball-season-${seasonToId(seasonData.season)}"
            data-season="${seasonData.season}"
        >
            ${artworkHTML}

            <div class="basketball-season-info">
                <h2>${seasonData.season}</h2>

                <h3>
                    ${seasonData.record || ""}
                    ${seasonData.conferenceRecord
                        ? `(${seasonData.conferenceRecord})`
                        : ""}
                    ${seasonData.conferenceFinish || ""}
                </h3>

                ${seasonData.postseason
                    ? `<p>${seasonData.postseason}</p>`
                    : ""}
            </div>
        </section>
    `;

    basketballSeasonContainer.insertAdjacentHTML(
        "beforeend",
        seasonHTML
    );
}

function renderBasketballArtwork(filename, season) {
    return `
        <img
            class="basketball-season-uniform"
            src="../Images/Database/Basketball/${filename}"
            alt="${season} West Virginia men's basketball uniform"
            loading="lazy"
        >
    `;
}

function seasonToId(season) {
    return String(season).replace(/[^a-zA-Z0-9]/g, "-");
}