function renderGameCard(game) {
    const card = document.createElement("section");
    card.className = "season-game";

    card.innerHTML = `
        <div class="matchup-art">
            <img src="../Images/Database/WVU/${game.wvuArtwork}" alt="West Virginia uniform">
            <img src="../Images/Database/Opponents/${game.opponentArtwork}" alt="${game.opponent} uniform">
        </div>

        ${game.event ? `<h2>${game.event}</h2>` : ""}

        <h3>${game.stadium}, ${game.city}, ${game.state}</h3>
        <h3>${formatDate(game.date)}</h3>
        <p>${formatScore(game)}</p>
    `;

    return card;
}

function formatDate(dateString) {
    const [year, month, day] = dateString.split("-").map(Number);

    return new Date(year, month - 1, day).toLocaleDateString("en-US", {
        month: "long",
        day: "numeric",
        year: "numeric"
    });
}

function formatScore(game) {
    if (game.location === "home") {
        return `${game.opponent} ${game.opponentScore} at West Virginia ${game.wvuScore}`;
    }

    if (game.location === "away") {
        return `West Virginia ${game.wvuScore} at ${game.opponent} ${game.opponentScore}`;
    }

    return `${game.opponent} ${game.opponentScore} vs West Virginia ${game.wvuScore}`;
}