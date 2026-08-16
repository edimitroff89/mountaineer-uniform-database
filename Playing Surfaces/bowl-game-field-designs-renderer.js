const bowlFieldContainer = document.getElementById(
    "bowlFieldOverview"
);

renderAllBowlFields();

function renderAllBowlFields() {
    if (!bowlFieldContainer) {
        return;
    }

    bowlFieldContainer.innerHTML = "";

    const sortedFields = [...BOWL_GAME_FIELD_DESIGNS]
        .sort((a, b) => Number(b.season) - Number(a.season));

    sortedFields.forEach(renderBowlField);

    const params = new URLSearchParams(window.location.search);
    const requestedSeason = params.get("season");

    if (requestedSeason) {
        requestAnimationFrame(() => {
            document
                .getElementById(
                    `bowl-field-${seasonToId(requestedSeason)}`
                )
                ?.scrollIntoView({
                    behavior: "smooth",
                    block: "start"
                });
        });
    }
}

function renderBowlField(fieldData) {
    const seasonId = seasonToId(fieldData.season);

    const fieldHTML = `
        <section
            class="field-design-card"
            id="bowl-field-${seasonId}"
            data-season="${fieldData.season}"
        >
            <div class="field-design-frame">
                <img
                    class="field-design-image"
                    src="../Images/Database/Playing Surfaces/${fieldData.artwork}"
                    alt="${fieldData.title}"
                    loading="lazy"
                >
            </div>

            <div class="field-design-info">
                <h2>${fieldData.season}</h2>

                ${
                    fieldData.bowl
                        ? `<h3>${fieldData.bowl}</h3>`
                        : ""
                }

                ${
                    fieldData.opponent
                        ? `<p class="field-matchup">
                            West Virginia vs ${fieldData.opponent}
                           </p>`
                        : ""
                }

                ${
                    fieldData.description
                        ? `<p>${fieldData.description}</p>`
                        : ""
                }
            </div>
        </section>
    `;

    bowlFieldContainer.insertAdjacentHTML(
        "beforeend",
        fieldHTML
    );
}

function seasonToId(season) {
    return String(season).replace(/[^a-zA-Z0-9]/g, "-");
}