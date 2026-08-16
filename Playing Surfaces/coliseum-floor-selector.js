document.addEventListener("DOMContentLoaded", () => {
    const floorSelect = document.getElementById(
        "coliseumFloorSelect"
    );

    if (!floorSelect) {
        return;
    }

    const floorCards = Array.from(
        document.querySelectorAll(
            "#coliseumFloorOverview [data-season]"
        )
    );

    floorCards.forEach(card => {
        const season = card.dataset.season;

        const heading = card.querySelector(
            ".field-design-info h3"
        );

        const option = document.createElement("option");

        option.value = season;
        option.textContent = heading
            ? `${season} — ${heading.textContent}`
            : season;

        floorSelect.appendChild(option);
    });

    const params = new URLSearchParams(window.location.search);
    const requestedSeason = params.get("season");

    if (requestedSeason) {
        floorSelect.value = requestedSeason;
    }

    floorSelect.addEventListener("change", () => {
        const selectedSeason = floorSelect.value;

        if (!selectedSeason) {
            return;
        }

        const seasonId = selectedSeason.replace(
            /[^a-zA-Z0-9]/g,
            "-"
        );

        document
            .getElementById(`coliseum-floor-${seasonId}`)
            ?.scrollIntoView({
                behavior: "smooth",
                block: "start"
            });

        const url = new URL(window.location.href);
        url.searchParams.set("season", selectedSeason);

        window.history.replaceState({}, "", url);
    });
});