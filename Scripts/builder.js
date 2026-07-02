// ======================================
// Mountaineer Uniform Builder
// Version 1.1
// ======================================

const state = {};

// ======================================
// Initialize State
// ======================================

function initializeState() {

    LAYERS.forEach(layer => {

        const defaultIndex = CONFIG[layer].findIndex(
            option => option.label === DEFAULTS[layer]
        );

        state[layer] = {
            index: defaultIndex >= 0 ? defaultIndex : 0,
            locked: false
        };

    });

}

// ======================================
// Build Controls
// ======================================

function buildControls() {

    const selectors = document.getElementById("selectors");
    selectors.innerHTML = "";

    LAYERS.forEach(layer => {

        const row = document.createElement("div");
        row.className = "selector";

        row.innerHTML = `
            <div class="selector-title">${layer}</div>

            <button onclick="previousOption('${layer}')">&#9664;</button>

            <div class="selector-label" id="${layer}Label"></div>

            <button onclick="nextOption('${layer}')">&#9654;</button>

            <div
                class="lock"
                id="${layer}Lock"
                onclick="toggleLock('${layer}')">
                🔓
            </div>
        `;

        selectors.appendChild(row);

    });

}

// ======================================
// Image Path
// ======================================

function imagePath(layer) {

    const item = CONFIG[layer][state[layer].index];

    return `Images/${layer}/${item.file}`;

}

// ======================================
// Update One Layer
// ======================================

function updateLayer(layer) {

    const img = document.getElementById(layer.toLowerCase() + "Layer");

    const item = CONFIG[layer][state[layer].index];

    img.src = imagePath(layer);

    document.getElementById(layer + "Label").textContent = item.label;

}

// ======================================
// Refresh Entire Uniform
// ======================================

function refresh() {

    LAYERS.forEach(updateLayer);

}

// ======================================
// Next Option
// ======================================
function markCustom() {

    const select = document.getElementById("presetSelect");

    if (select) {
        select.value = "";
    }

    const currentEquipment = getCurrentEquipment();
    const displayTitle = getUniformTitle(currentEquipment);

    updateInfoPanel(
        displayTitle,
        "Custom uniform combination.",
        currentEquipment
    );

}

function nextOption(layer) {

    const options = CONFIG[layer];

    state[layer].index++;

    if (state[layer].index >= options.length) {
        state[layer].index = 0;
    }

    updateLayer(layer);
    markCustom();

}

// ======================================
// Previous Option
// ======================================

function previousOption(layer) {

    const options = CONFIG[layer];

    state[layer].index--;

    if (state[layer].index < 0) {
        state[layer].index = options.length - 1;
    }
markCustom();
    updateLayer(layer);

}

// ======================================
// Toggle Lock
// ======================================

function toggleLock(layer) {

    state[layer].locked = !state[layer].locked;

    const lock = document.getElementById(layer + "Lock");

    if (state[layer].locked) {

        lock.textContent = "🔒";
        lock.classList.add("active");

    } else {

        lock.textContent = "🔓";
        lock.classList.remove("active");

    }

}

// ======================================
// Randomize Uniform
// ======================================

function randomizeUniform() {

    LAYERS.forEach(layer => {

        if (state[layer].locked) return;

        state[layer].index =
            Math.floor(Math.random() * CONFIG[layer].length);

    });

refresh();
markCustom();
}

// ======================================
// Reset Uniform
// ======================================

function resetUniform() {

    LAYERS.forEach(layer => {

        const defaultIndex = CONFIG[layer].findIndex(
            option => option.label === DEFAULTS[layer]
        );

        state[layer].index = defaultIndex >= 0 ? defaultIndex : 0;

        state[layer].locked = false;

        const lock = document.getElementById(layer + "Lock");

        lock.textContent = "🔓";
        lock.classList.remove("active");

    });

refresh();
markCustom();
}

// ======================================
// Presets
// ======================================

function buildPresetMenu() {

    const select = document.getElementById("presetSelect");

    select.innerHTML = '<option value="">Custom</option>';

    Object.keys(COMBINATIONS).forEach(key => {

        const combo = COMBINATIONS[key];

        const option = document.createElement("option");

        option.value = key;
        option.textContent = combo.title;

        select.appendChild(option);

    });

    select.addEventListener("change", function () {

        if (!this.value) return;

        loadPreset(this.value);

    });

}
// ======================================
// Uniform Statistics
// ======================================

function getUniformTitle(equipment) {

    return [
        equipment.HelmetStatColor || equipment.Helmet,
        equipment.JerseyStatColor || equipment.Jersey,
        equipment.PantsStatColor || equipment.Pants
    ].join(" / ");

}

function normalizeColor(value) {

    if (!value) return "";

    if (value.includes("Blue")) return "Blue";
    if (value.includes("Gold")) return "Gold";
    if (value.includes("White")) return "White";
    if (value.includes("Gray")) return "Gray";
    if (value.includes("Black")) return "Black";

    return value;
}
function getPrimaryComboKey(equipment) {

    const helmetColor = equipment.HelmetStatColor || normalizeColor(equipment.Helmet);
    const jerseyColor = equipment.JerseyStatColor || normalizeColor(equipment.Jersey);
    const pantsColor = equipment.PantsStatColor || normalizeColor(equipment.Pants);

    return Object.keys(COMBINATIONS).find(key => {

        const combo = COMBINATIONS[key];

        return (
            normalizeColor(combo.primary.Helmet) === helmetColor &&
            normalizeColor(combo.primary.Jersey) === jerseyColor &&
            normalizeColor(combo.primary.Pants) === pantsColor
        );

    });

}

function getGamesForCombo(comboKey) {

    if (!comboKey) return [];

    return GAMES.filter(game => game.combination === comboKey);

}

function getGamesWorn(comboKey) {

    return getGamesForCombo(comboKey).length;

}
function getLastWorn(comboKey) {

    const games = getGamesForCombo(comboKey)
        .filter(game => game.date)
        .sort((a, b) => new Date(b.date) - new Date(a.date));

    return games[0] || null;

}
function getRecordForCombo(comboKey) {

    const games = getGamesForCombo(comboKey);

    let wins = 0;
    let losses = 0;
    let ties = 0;

    games.forEach(game => {

        if (!game.result || game.result === "TBD") return;

        const result = game.result.trim().toUpperCase();

        if (result.startsWith("W")) wins++;
        else if (result.startsWith("L")) losses++;
        else if (result.startsWith("T")) ties++;

    });

    return {
        wins,
        losses,
        ties,
        total: wins + losses + ties
    };

}

function formatRecord(record) {

    if (record.total === 0) return "—";

    if (record.ties > 0) {
        return `${record.wins}-${record.losses}-${record.ties}`;
    }

    return `${record.wins}-${record.losses}`;

}

function updateInfoPanel(title, description, equipment = null) {

    document.getElementById("infoTitle").textContent = title;

    if (!equipment) {
        document.getElementById("infoDescription").innerHTML = `
            Record<br>
            —<br><br>

            Total Times Worn<br>
            0<br><br>

            Last Worn<br>
            Never
        `;
        return;
    }

const displayTitle = getUniformTitle(equipment);
const comboKey = getPrimaryComboKey(equipment);

const gamesWorn = getGamesWorn(comboKey);
const record = formatRecord(getRecordForCombo(comboKey));
const lastGame = getLastWorn(comboKey);

let lastWornText = "Never";

if (lastGame) {

    const date = new Date(lastGame.date);

    lastWornText = `
        ${date.toLocaleDateString("en-US", {
            year: "numeric",
            month: "long",
            day: "numeric"
        })}<br>
        vs ${lastGame.opponent}
    `;

}
    document.getElementById("infoTitle").textContent = displayTitle;

document.getElementById("infoDescription").innerHTML = `
    <div class="stat-grid">

        <div class="stat-item">
            <div class="stat-icon">
                <i class="fa-solid fa-chart-column"></i>
            </div>
            <div class="stat-label">Record</div>
            <div class="stat-value">${record}</div>
        </div>

        <div class="stat-item">
            <div class="stat-icon">
                <i class="fa-solid fa-shirt"></i>
            </div>
            <div class="stat-label">Total Times Worn</div>
            <div class="stat-value">${gamesWorn}</div>
        </div>

        <div class="stat-item">
            <div class="stat-icon">
                <i class="fa-solid fa-calendar-days"></i>
            </div>
            <div class="stat-label">Last Worn</div>
            <div class="stat-value small">${lastWornText}</div>
        </div>

    </div>
`;
}

function loadPreset(key) {

    const combo = COMBINATIONS[key];

    const equipment = {
        ...combo.primary,
        ...combo.accessories
    };

    LAYERS.forEach(layer => {

        const index = CONFIG[layer].findIndex(option =>
            option.label === equipment[layer]
        );

        if (index >= 0) {
            state[layer].index = index;
        }

    });

updateInfoPanel(
    combo.title,
    combo.description,
    getCurrentEquipment()
);
    refresh();

}
function getCurrentEquipment() {

    const equipment = {};

    LAYERS.forEach(layer => {

        const item = CONFIG[layer][state[layer].index];

        equipment[layer] = item.label;
        equipment[layer + "StatColor"] = item.statColor;

    });

    return equipment;

}
// ======================================
// Initialize
// ======================================

initializeState();

buildControls();

buildPresetMenu();

refresh();
async function exportPNG() {
    const canvas = document.createElement("canvas");
    const ctx = canvas.getContext("2d");

    canvas.width = 1200;
    canvas.height = 1500;

const exportOrder = [
    "watermarkLayer",
    "leggingsLayer",
    "pantsLayer",
    "cleatsLayer",
    "jerseyLayer",
    "sleevesLayer",
    "glovesLayer",
    "helmetLayer"
];

    for (const id of exportOrder) {
        const img = document.getElementById(id);

        await new Promise(resolve => {
            if (img.complete) {
                resolve();
            } else {
                img.onload = resolve;
            }
        });

        ctx.drawImage(img, 0, 0, canvas.width, canvas.height);
    }

    const link = document.createElement("a");
    link.download = "WVU-Uniform.png";
    link.href = canvas.toDataURL("image/png");
    link.click();
}

// ======================================
// Toolbar Buttons
// ======================================

document
    .getElementById("randomizeBtn")
    .addEventListener("click", randomizeUniform);

document
    .getElementById("resetBtn")
    .addEventListener("click", resetUniform);

document
    .getElementById("exportBtn")
    .addEventListener("click", exportPNG);