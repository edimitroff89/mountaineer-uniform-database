const baseballSeasonContainer = document.getElementById(
    "baseballSeasonOverview"
);

renderAllBaseballSeasons();

function renderAllBaseballSeasons() {
    if (!baseballSeasonContainer) {
        return;
    }

    baseballSeasonContainer.innerHTML = "";

    const sortedSeasons = [...BASEBALL_SEASONS].sort((a, b) => {
        return Number(b.season) - Number(a.season);
    });

    sortedSeasons.forEach(renderBaseballSeason);

    const params = new URLSearchParams(window.location.search);
    const requestedSeason = params.get("season");

    if (requestedSeason) {
        requestAnimationFrame(() => {
            document
                .getElementById(
                    `baseball-season-${seasonToId(requestedSeason)}`
                )
                ?.scrollIntoView({
                    behavior: "smooth",
                    block: "start"
                });
        });
    }
}

function renderBaseballSeason(seasonData) {
    const artwork = Array.isArray(seasonData.artwork)
        ? seasonData.artwork
        : [];

    const seasonId = seasonToId(seasonData.season);

    const seasonHTML = `
        <section
            class="season-card"
            id="baseball-season-${seasonId}"
            data-season="${seasonData.season}"
        >
            <div class="season-frame">
                <div class="season-watermark"></div>

                ${
                    artwork.length > 0
                        ? `
                            <div class="season-grid custom-layout">
                                ${renderBaseballRows(
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

                ${
                    seasonData.record
                        ? `
                            <h3>
                                ${buildBaseballRecordLine(seasonData)}
                            </h3>
                        `
                        : ""
                }

                ${
                    seasonData.postseason
                        ? `<p>${seasonData.postseason}</p>`
                        : ""
                }
            </div>
        </section>
    `;

    baseballSeasonContainer.insertAdjacentHTML(
        "beforeend",
        seasonHTML
    );
}

function renderBaseballRows(artwork, season) {
    const layout = getBaseballLayout(artwork.length);
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
                        renderBaseballArtwork(filename, season)
                    )
                    .join("")}
            </div>
        `)
        .join("");
}

function getBaseballLayout(count) {
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

function renderBaseballArtwork(filename, season) {
    return `
        <div class="baseball-uniform-item">
            <img
                class="baseball-uniform-image"
                src="../Images/Database/Baseball/${filename}"
                alt="${season} West Virginia baseball uniform"
                loading="lazy"
            >
        </div>
    `;
}

function buildBaseballRecordLine(seasonData) {
    const parts = [];

    if (seasonData.record) {
        parts.push(seasonData.record);
    }

    if (seasonData.conferenceRecord) {
        parts.push(`(${seasonData.conferenceRecord})`);
    }

    if (seasonData.conferenceFinish) {
        parts.push(seasonData.conferenceFinish);
    }

    return parts.join(" ");
}

function seasonToId(season) {
    return String(season).replace(/[^a-zA-Z0-9]/g, "-");
}