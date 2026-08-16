const seasonPageParams = new URLSearchParams(window.location.search);
const season = Number(seasonPageParams.get("year")) || 2024;

const title = document.getElementById("seasonTitle");
const container = document.getElementById("seasonGames");

const searchInput = document.getElementById("gameSearch");
const locationFilter = document.getElementById("locationFilter");
const resultFilter = document.getElementById("resultFilter");
const gameTypeFilter = document.getElementById("gameTypeFilter");

title.textContent = season;

const seasonGames = GAMES
    .filter(game => game.season === season)
    .sort((a, b) => parseLocalDate(a.date) - parseLocalDate(b.date));

renderGames(seasonGames);

[searchInput, locationFilter, resultFilter, gameTypeFilter].forEach(control => {
    if (control) {
        control.addEventListener("input", applyFilters);
        control.addEventListener("change", applyFilters);
    }
});

function applyFilters() {
    const searchTerm = searchInput.value.trim().toLowerCase();
    const locationValue = locationFilter.value;
    const resultValue = resultFilter.value;
    const gameTypeValue = gameTypeFilter.value;

    const filteredGames = seasonGames.filter(game => {
        const searchableText = [
            game.season,
            game.opponent,
            game.date,
            game.location,
            game.stadium,
            game.city,
            game.state,
            game.gameType,
            game.event,
            game.result,
            game.combination,
            game.wvuArtwork,
            game.opponentArtwork
        ].join(" ").toLowerCase();

        const matchesSearch = !searchTerm || searchableText.includes(searchTerm);
        const matchesLocation = !locationValue || game.location === locationValue;
        const matchesResult = !resultValue || game.result?.toUpperCase() === resultValue;
        const matchesGameType = !gameTypeValue || game.gameType === gameTypeValue;

        return matchesSearch && matchesLocation && matchesResult && matchesGameType;
    });

    renderGames(filteredGames);
}

function renderGames(games) {
    container.innerHTML = "";

    if (games.length === 0) {
        container.innerHTML = `<p class="no-results">No games match your search.</p>`;
        return;
    }

    games.forEach(game => {
        container.appendChild(renderGameCard(game));
    });
}

function parseLocalDate(dateString) {
    const [year, month, day] = dateString.split("-").map(Number);
    return new Date(year, month - 1, day);
}