document.addEventListener("DOMContentLoaded", () => {
    const bowlFieldSelect = document.getElementById(
        "bowlFieldSelect"
    );

    if (!bowlFieldSelect) {
        return;
    }

    const fieldCards = Array.from(
        document.querySelectorAll(
            "#bowlFieldOverview [data-season]"
        )
    );

    fieldCards.forEach(card => {
        const season = card.dataset.season;
        const heading = card.querySelector(
            ".field-design-info h3"
        );

        const option = document.createElement("option");

        option.value = season;
        option.textContent = heading
            ? `${season} — ${heading.textContent}`
            : season;

        bowlFieldSelect.appendChild(option);
    });

    const params = new URLSearchParams(window.location.search);
    const requestedSeason = params.get("season");

    if (requestedSeason) {
        bowlFieldSelect.value = requestedSeason;
    }

    bowlFieldSelect.addEventListener("change", () => {
        const selectedSeason = bowlFieldSelect.value;

        if (!selectedSeason) {
            return;
        }

        const seasonId = selectedSeason.replace(
            /[^a-zA-Z0-9]/g,
            "-"
        );

        document
            .getElementById(`bowl-field-${seasonId}`)
            ?.scrollIntoView({
                behavior: "smooth",
                block: "start"
            });

        const url = new URL(window.location.href);
        url.searchParams.set("season", selectedSeason);

        window.history.replaceState({}, "", url);
    });
});