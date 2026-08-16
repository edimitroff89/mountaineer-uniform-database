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
        return getStartingYear(b.season) - getStartingYear(a.season);
    });

    sortedSeasons.forEach(renderBasketballSeason);
}

function renderBasketballSeason(seasonData) {
    const artwork = Array.isArray(seasonData.artwork)
        ? seasonData.artwork
        : [];

    const seasonId = seasonToId(seasonData.season);

    const seasonHTML = `
        <section
            class="season-card"
            id="basketball-season-${seasonId}"
            data-season="${seasonData.season}"
        >
            <div class="season-frame">
                <div class="season-watermark"></div>

                ${
                    artwork.length
                        ? `
                            <div class="season-grid custom-layout">
                                ${renderBasketballRows(
                                    artwork,
                                    seasonData.season
                                )}
                            </div>
                        `
                        : `
                            <div class="season-empty">
                                Uniform artwork coming soon.
                            </div>
                        `
                }
            </div>

            <div class="season-info">
                <h2>${seasonData.season}</h2>

                <h3>
                    ${seasonData.record || ""}
                    ${
                        seasonData.conferenceRecord
                            ? `(${seasonData.conferenceRecord})`
                            : ""
                    }
                    ${seasonData.conferenceFinish || ""}
                </h3>

                ${
                    seasonData.postseason
                        ? `<p>${seasonData.postseason}</p>`
                        : ""
                }
            </div>
        </section>
    `;

    basketballSeasonContainer.insertAdjacentHTML(
        "beforeend",
        seasonHTML
    );
}

function renderBasketballRows(artwork, season) {
    const layout = getBasketballLayout(artwork.length);
    const rows = [];

    let startIndex = 0;

    layout.forEach(rowCount => {
        rows.push(
            artwork.slice(startIndex, startIndex + rowCount)
        );

        startIndex += rowCount;
    });

    return rows
        .map(row => `
            <div class="season-row">
                ${row
                    .map(filename =>
                        renderBasketballArtwork(filename, season)
                    )
                    .join("")}
            </div>
        `)
        .join("");
}
function getBasketballLayout(count) {
    const layouts = {
        1: [1],
        2: [2],
        3: [3],
        4: [4],

        5: [3, 2],
        6: [3, 3],
        7: [4, 3],
        8: [4, 4],

        9: [3, 3, 3],
        10: [4, 3, 3],
        11: [4, 3, 4],
        12: [4, 4, 4],

        13: [4, 3, 3, 3],
        14: [4, 3, 3, 4],
        15: [4, 4, 3, 4],
        16: [4, 4, 4, 4]
    };

    if (layouts[count]) {
        return layouts[count];
    }

    const layout = [];
    let remaining = count;

    while (remaining > 4) {
        layout.push(4);
        remaining -= 4;
    }

    if (remaining > 0) {
        layout.push(remaining);
    }

    return layout;
}
function renderBasketballArtwork(filename, season) {
    return `
        <div class="basketball-uniform-item">
            <img
                class="basketball-uniform-image"
                src="../Images/Database/Basketball/${filename}"
                alt="${season} West Virginia men's basketball uniform"
                loading="lazy"
            >
        </div>
    `;
}

function getStartingYear(season) {
    return Number(String(season).split("-")[0]);
}

function seasonToId(season) {
    return String(season).replace(/[^a-zA-Z0-9]/g, "-");
}