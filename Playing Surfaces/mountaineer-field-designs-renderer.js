const fieldDesignContainer = document.getElementById(
    "fieldDesignOverview"
);

renderAllFieldDesigns();

function renderAllFieldDesigns() {
    if (!fieldDesignContainer) {
        return;
    }

    fieldDesignContainer.innerHTML = "";

    const sortedDesigns = [...MOUNTAINEER_FIELD_DESIGNS]
        .sort((a, b) => Number(b.season) - Number(a.season));

    sortedDesigns.forEach(renderFieldDesign);

    const params = new URLSearchParams(window.location.search);
    const requestedSeason = params.get("season");

    if (requestedSeason) {
        requestAnimationFrame(() => {
            document
                .getElementById(
                    `field-design-${seasonToId(requestedSeason)}`
                )
                ?.scrollIntoView({
                    behavior: "smooth",
                    block: "start"
                });
        });
    }
}

function renderFieldDesign(fieldData) {
    const seasonId = seasonToId(fieldData.season);

    const fieldHTML = `
        <section
            class="field-design-card"
            id="field-design-${seasonId}"
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
                    fieldData.title
                        ? `<h3>${fieldData.title}</h3>`
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

    fieldDesignContainer.insertAdjacentHTML(
        "beforeend",
        fieldHTML
    );
}
function seasonToId(season) {
    return String(season).replace(/[^a-zA-Z0-9]/g, "-");
}