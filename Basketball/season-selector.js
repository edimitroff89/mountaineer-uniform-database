document.addEventListener("DOMContentLoaded", () => {
    const seasonSelect = document.getElementById(
        "basketballSeasonSelect"
    );

    if (!seasonSelect) {
        return;
    }

    const seasonCards = Array.from(
        document.querySelectorAll(
            "#basketballSeasonOverview [data-season]"
        )
    );

    seasonCards.forEach(card => {
        const season = card.dataset.season;

        const option = document.createElement("option");
        option.value = season;
        option.textContent = season;

        seasonSelect.appendChild(option);
    });

    const params = new URLSearchParams(window.location.search);
    const requestedSeason = params.get("season");

    if (requestedSeason) {
        seasonSelect.value = requestedSeason;
    }

    seasonSelect.addEventListener("change", () => {
        const selectedSeason = seasonSelect.value;

        if (!selectedSeason) {
            return;
        }

        const seasonId = selectedSeason.replace(
            /[^a-zA-Z0-9]/g,
            "-"
        );

        document
            .getElementById(`basketball-season-${seasonId}`)
            ?.scrollIntoView({
                behavior: "smooth",
                block: "start"
            });

        const url = new URL(window.location.href);
        url.searchParams.set("season", selectedSeason);
        window.history.replaceState({}, "", url);
    });
});