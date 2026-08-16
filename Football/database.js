const resultsContainer = document.getElementById("databaseResults");
const resultCount = document.getElementById("resultCount");

const filters = {
    text: document.getElementById("textSearch"),
    season: document.getElementById("seasonFilter"),
    opponent: document.getElementById("opponentFilter"),
    gameType: document.getElementById("gameTypeFilter"),
    location: document.getElementById("locationFilter"),
    result: document.getElementById("resultFilter"),
    helmet: document.getElementById("helmetFilter"),
    jersey: document.getElementById("jerseyFilter"),
    pants: document.getElementById("pantsFilter")
};

const resetButton = document.getElementById("resetFilters");
const allGames = [...GAMES].sort((a, b) => parseLocalDate(b.date) - parseLocalDate(a.date));

populateAllFilters();
applyDatabaseFilters();

Object.values(filters).forEach(control => {
    control.addEventListener("input", applyDatabaseFilters);
    control.addEventListener("change", applyDatabaseFilters);
});

if (resetButton) {
    resetButton.addEventListener("click", resetFilters);
}

function applyDatabaseFilters() {
    const filtered = getFilteredGames();
    renderDatabaseResults(filtered);
    updateCascadingFilters(filtered);
}

function getFilteredGames(ignoreFilterName = null) {
    const text = filters.text.value.trim().toLowerCase();

    return allGames.filter(game => {
        const parts = getUniformParts(game.combination);
        const searchable = buildSearchableText(game, parts);

        return (
            (!text || searchable.includes(text)) &&
            (ignoreFilterName === "season" || !filters.season.value || String(game.season) === filters.season.value) &&
            (ignoreFilterName === "opponent" || !filters.opponent.value || game.opponent === filters.opponent.value) &&
            (ignoreFilterName === "gameType" || !filters.gameType.value || game.gameType === filters.gameType.value) &&
            (ignoreFilterName === "location" || !filters.location.value || game.location === filters.location.value) &&
            (ignoreFilterName === "result" || !filters.result.value || (game.result && game.result.toUpperCase()) === filters.result.value) &&
            (ignoreFilterName === "helmet" || !filters.helmet.value || parts.helmet === filters.helmet.value) &&
            (ignoreFilterName === "jersey" || !filters.jersey.value || parts.jersey === filters.jersey.value) &&
            (ignoreFilterName === "pants" || !filters.pants.value || parts.pants === filters.pants.value)
        );
    });
}

function updateCascadingFilters() {
    updateSelectOptions("season", unique(getFilteredGames("season").map(g => g.season)).sort((a, b) => b - a));
    updateSelectOptions("opponent", unique(getFilteredGames("opponent").map(g => g.opponent)).sort());
    updateSelectOptions("gameType", unique(getFilteredGames("gameType").map(g => g.gameType)).sort());
    updateSelectOptions("location", unique(getFilteredGames("location").map(g => g.location)).sort());
    updateSelectOptions("result", unique(getFilteredGames("result").map(g => g.result && g.result.toUpperCase())).sort());

    updateSelectOptions("helmet", unique(getFilteredGames("helmet").map(g => getUniformParts(g.combination).helmet)).sort());
    updateSelectOptions("jersey", unique(getFilteredGames("jersey").map(g => getUniformParts(g.combination).jersey)).sort());
    updateSelectOptions("pants", unique(getFilteredGames("pants").map(g => getUniformParts(g.combination).pants)).sort());
}

function populateAllFilters() {
    updateSelectOptions("season", unique(allGames.map(g => g.season)).sort((a, b) => b - a));
    updateSelectOptions("opponent", unique(allGames.map(g => g.opponent)).sort());
    updateSelectOptions("gameType", unique(allGames.map(g => g.gameType)).sort());
    updateSelectOptions("location", unique(allGames.map(g => g.location)).sort());
    updateSelectOptions("result", ["W", "L"]);

    updateSelectOptions("helmet", unique(allGames.map(g => getUniformParts(g.combination).helmet)).sort());
    updateSelectOptions("jersey", unique(allGames.map(g => getUniformParts(g.combination).jersey)).sort());
    updateSelectOptions("pants", unique(allGames.map(g => getUniformParts(g.combination).pants)).sort());
}

function updateSelectOptions(filterName, values) {
    const select = filters[filterName];
    const currentValue = select.value;
    const firstOptionText = select.options[0].textContent;

    select.innerHTML = `<option value="">${firstOptionText}</option>`;

    values.filter(Boolean).forEach(value => {
        const option = document.createElement("option");
        option.value = value;
        option.textContent = formatOption(value);
        select.appendChild(option);
    });

    if ([...select.options].some(option => option.value === currentValue)) {
        select.value = currentValue;
    }
}

function renderDatabaseResults(games) {
    resultsContainer.innerHTML = "";
    resultCount.textContent = `${games.length} game${games.length === 1 ? "" : "s"} found`;

    if (games.length === 0) {
        resultsContainer.innerHTML = `<p class="no-results">No games match your filters.</p>`;
        return;
    }

    games.forEach(game => {
        const card = renderGameCard(game);
        card.classList.add("database-result-card");
        resultsContainer.appendChild(card);
    });
}

function buildSearchableText(game, parts) {
    return [
        game.season,
        game.opponent,
        game.date,
        game.location,
        game.gameType,
        game.event,
        game.stadium,
        game.city,
        game.state,
        game.result,
        game.wvuScore,
        game.opponentScore,
        game.combination,
        parts.helmet,
        parts.jersey,
        parts.pants,
        game.wvuArtwork,
        game.opponentArtwork
    ].join(" ").toLowerCase();
}

function resetFilters() {
    Object.values(filters).forEach(control => {
        control.value = "";
    });

    applyDatabaseFilters();
}

function getUniformParts(combination = "") {
    const parts = combination.match(/[A-Z][a-z]*/g) || [];

    return {
        helmet: parts[0] || "",
        jersey: parts[1] || "",
        pants: parts[2] || ""
    };
}

function unique(values) {
    return [...new Set(values.filter(Boolean))];
}

function formatOption(value) {
    return String(value)
        .replace(/([a-z])([A-Z])/g, "$1 $2")
        .replace(/\b\w/g, letter => letter.toUpperCase());
}

function parseLocalDate(dateString) {
    const [year, month, day] = dateString.split("-").map(Number);
    return new Date(year, month - 1, day);
}