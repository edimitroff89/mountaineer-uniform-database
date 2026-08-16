document.addEventListener("DOMContentLoaded", () => {
    const seasonSelect = document.getElementById("seasonSelect");

    if (!seasonSelect) {
        return;
    }

    /*
     * Find headings containing only a four-digit season year.
     * This avoids changing the existing season renderer.
     */
    const seasonHeadings = Array.from(
        document.querySelectorAll("#seasonOverview h1, #seasonOverview h2, #seasonOverview h3")
    ).filter(heading => /^\d{4}$/.test(heading.textContent.trim()));

    const seasons = seasonHeadings
        .map(heading => ({
            year: heading.textContent.trim(),
            heading
        }))
        .sort((a, b) => Number(b.year) - Number(a.year));

    seasons.forEach(({ year, heading }) => {
        heading.id = `season-${year}`;

        const option = document.createElement("option");
        option.value = year;
        option.textContent = year;

        seasonSelect.appendChild(option);
    });

    seasonSelect.addEventListener("change", () => {
        const selectedYear = seasonSelect.value;

        if (!selectedYear) {
            return;
        }

        const selectedSeason = document.getElementById(
            `season-${selectedYear}`
        );

        if (selectedSeason) {
            selectedSeason.scrollIntoView({
                behavior: "smooth",
                block: "start"
            });
        }
    });
});