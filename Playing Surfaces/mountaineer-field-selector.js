document.addEventListener("DOMContentLoaded", () => {
    const fieldSelect = document.getElementById(
        "fieldSeasonSelect"
    );

    if (!fieldSelect) {
        return;
    }

    const fieldCards = Array.from(
        document.querySelectorAll(
            "#fieldDesignOverview [data-season]"
        )
    );

    fieldCards.forEach(card => {
        const season = card.dataset.season;

        const option = document.createElement("option");
        option.value = season;
        option.textContent = season;

        fieldSelect.appendChild(option);
    });

    const params = new URLSearchParams(window.location.search);
    const requestedSeason = params.get("season");

    if (requestedSeason) {
        fieldSelect.value = requestedSeason;
    }

    fieldSelect.addEventListener("change", () => {
        const selectedSeason = fieldSelect.value;

        if (!selectedSeason) {
            return;
        }

        const seasonId = selectedSeason.replace(
            /[^a-zA-Z0-9]/g,
            "-"
        );

        document
            .getElementById(`field-design-${seasonId}`)
            ?.scrollIntoView({
                behavior: "smooth",
                block: "start"
            });

        const url = new URL(window.location.href);
        url.searchParams.set("season", selectedSeason);

        window.history.replaceState({}, "", url);
    });
});