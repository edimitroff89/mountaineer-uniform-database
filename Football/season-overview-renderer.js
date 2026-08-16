// season-overview-renderer.js

const container = document.getElementById("seasonOverview");

renderAllSeasons();

function renderAllSeasons() {
    if (!container) return;

    // Clear the container one time before rendering begins.
    container.innerHTML = "";

    const sortedSeasons = [...FOOTBALL_SEASONS]
        .sort((a, b) => b.season - a.season);

    sortedSeasons.forEach(seasonData => {
        renderSeason(seasonData);
    });

    // Preserve old links such as:
    // season-overview.html?year=2024
    const params = new URLSearchParams(window.location.search);
    const requestedYear = params.get("year");

    if (requestedYear) {
        window.requestAnimationFrame(() => {
            document
                .getElementById(`season-${requestedYear}`)
                ?.scrollIntoView({
                    behavior: "smooth",
                    block: "start"
                });
        });
    }
}

function renderSeason(seasonData) {
    const season = seasonData.season;

    const allSeasonGames = GAMES
        .filter(game => game.season === season)
        .sort((a, b) => parseLocalDate(a.date) - parseLocalDate(b.date));

    const uniqueGames = getUniqueUniformGames(allSeasonGames);

    /*
     * Some older seasons may exist in football-seasons.js but may not
     * have uniform artwork in games.js yet. Skip those seasons without
     * erasing seasons that were already rendered.
     */
    if (uniqueGames.length === 0) {
        return;
    }

    const seasonHTML = `
        <section
            class="season-overview-page season-card"
            id="season-${season}"
            data-year="${season}"
        >
            <div class="season-frame">
                <div class="season-watermark"></div>

                <div class="season-grid custom-layout">
                    ${renderSeasonRows(uniqueGames)}
                </div>
            </div>

            <div class="season-info">
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

    container.insertAdjacentHTML("beforeend", seasonHTML);
}

function getUniqueUniformGames(games) {
    const uniqueGames = [];
    const seen = new Set();

    games.forEach(game => {
        if (!game.wvuArtwork) return;

        const key = game.wvuArtwork;

        if (!seen.has(key)) {
            seen.add(key);
            uniqueGames.push(game);
        }
    });

    return uniqueGames;
}

function renderSeasonRows(games) {
    const layout = getSeasonLayout(games.length);
    let index = 0;

    return layout.map(count => {
        const rowGames = games.slice(index, index + count);
        index += count;

        if (rowGames.length === 0) return "";

        return `
            <div class="season-row season-row-${rowGames.length}">
                ${rowGames.map(renderUniform).join("")}
            </div>
        `;
    }).join("");
}

function getSeasonLayout(count) {
    if (count >= 13) return [4, 3, 4, count - 11];
    if (count === 12) return [4, 4, 4];
    if (count === 11) return [4, 3, 4];
    if (count === 10) return [4, 3, 3];
    if (count === 9) return [3, 3, 3];
    if (count === 8) return [4, 4];
    if (count === 7) return [4, 3];
    if (count === 6) return [3, 3];
    if (count === 5) return [3, 2];
    if (count === 4) return [4];
    if (count === 3) return [3];
    if (count === 2) return [2];

    return [1];
}

function renderUniform(game) {
    return `
        <img
            class="season-uniform"
            src="../Images/Database/WVU/${game.wvuArtwork}"
            alt="West Virginia uniform vs ${game.opponent}"
            loading="lazy"
        >
    `;
}

function parseLocalDate(dateString) {
    const [year, month, day] = dateString.split("-").map(Number);
    return new Date(year, month - 1, day);
}