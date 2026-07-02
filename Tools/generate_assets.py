from pathlib import Path
import re

PROJECT_ROOT = Path(__file__).resolve().parent.parent

IMAGES_DIR = PROJECT_ROOT / "Images"
OUTPUT_FILE = PROJECT_ROOT / "Scripts" / "asset-manifest.js"

CATEGORIES = [
    "Helmet",
    "Jersey",
    "Pants",
    "Sleeves",
    "Gloves",
    "Cleats",
    "Leggings"
]

SPECIAL_WORDS = {
    "usa": "USA",
    "wv": "WV",
    "ncaa": "NCAA",
    "rgb": "RGB",
    "alt": "Alt",
    "home": "Home",
    "away": "Away",
    "throwback": "Throwback",
    "pro": "Pro",
    "combat": "Combat",
    "coal": "Coal",
    "gold": "Gold",
    "blue": "Blue",
    "white": "White",
    "gray": "Gray",
    "grey": "Gray",
    "black": "Black"
}

COLORS = {
    "blue": "Blue",
    "gold": "Gold",
    "white": "White",
    "gray": "Gray",
    "grey": "Gray",
    "black": "Black"
}


def make_label(filename):
    stem = Path(filename).stem
    parts = stem.split("-")

    if len(parts) < 3:
        words = parts[1:]
        return format_words(words)

    year = parts[1]
    words = parts[2:]

    return f"{year} {format_words(words)}"


def format_words(words):
    formatted = []

    for word in words:
        key = word.lower()

        if key in SPECIAL_WORDS:
            formatted.append(SPECIAL_WORDS[key])
        elif len(word) == 1:
            formatted.append(word.upper())
        else:
            formatted.append(word.capitalize())

    return " ".join(formatted)


def get_stat_color(filename):
    stem = Path(filename).stem
    parts = stem.split("-")

    for part in reversed(parts):
        key = part.lower()

        if key in COLORS:
            return COLORS[key]

    return "Unknown"


def sort_key(path):
    match = re.search(r"(\d{4})", path.stem)
    year = int(match.group(1)) if match else 0

    return (-year, path.name.lower())


def build_manifest():
    lines = []

    lines.append("// ========================================")
    lines.append("// AUTO-GENERATED FILE")
    lines.append("// Do NOT edit manually.")
    lines.append("// ========================================")
    lines.append("")
    lines.append("const ASSET_MANIFEST = {")

    for category in CATEGORIES:
        folder = IMAGES_DIR / category
        files = sorted(folder.glob("*.png"), key=sort_key)

        lines.append("")
        lines.append(f"    {category}: [")

        for png in files:
            label = make_label(png.name)
            stat_color = get_stat_color(png.name)

            lines.append(
                f'        {{ label: "{label}", file: "{png.name}", statColor: "{stat_color}" }},'
            )

        lines.append("    ],")

    lines.append("")
    lines.append("};")

    OUTPUT_FILE.write_text("\n".join(lines), encoding="utf-8")


def print_summary():
    print("----------------------------------------")

    total = 0

    for category in CATEGORIES:
        count = len(list((IMAGES_DIR / category).glob("*.png")))
        total += count

        print(f"{category:<12} {count:>3} PNGs")

    print("----------------------------------------")
    print(f"Total Assets: {total}")
    print("")
    print("asset-manifest.js generated successfully!")


build_manifest()
print_summary()