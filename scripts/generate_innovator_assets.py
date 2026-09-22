from __future__ import annotations

import json
import math
from pathlib import Path

from PIL import Image, ImageDraw, ImageFont


ROOT = Path(__file__).resolve().parents[1]
OUT = ROOT / "assets" / "pictures"
PUBLIC_OUT = ROOT / "public" / "pictures"
OUT.mkdir(parents=True, exist_ok=True)
PUBLIC_OUT.mkdir(parents=True, exist_ok=True)

W, H = 1600, 1000
BG = (7, 15, 28)
PANEL = (17, 29, 48)
PANEL_2 = (12, 23, 39)
WHITE = (244, 247, 250)
MUTED = (190, 201, 214)
LINE = (70, 91, 118)

FONT_DIR = Path("C:/Windows/Fonts")
REG_FONT = str(FONT_DIR / "arial.ttf")
BOLD_FONT = str(FONT_DIR / "arialbd.ttf")
REG = ImageFont.truetype(REG_FONT, 24)
SMALL = ImageFont.truetype(REG_FONT, 19)
HEAD = ImageFont.truetype(BOLD_FONT, 28)
TITLE = ImageFont.truetype(BOLD_FONT, 48)
TAG = ImageFont.truetype(BOLD_FONT, 20)


CONCEPTS = [
    ("01_aurora-veilight.png", "AURORA / VEILIGHT", "Two related but distinct research architectures", (139, 92, 246), "Fault-contained thermal handling and an externally powered lightsail coupon study.", ["Heat sectors", "Independent loops", "Thermal buffer", "Power conversion", "Beam source", "Sail coupon", "Flyby path"], "No new fusion reaction, crewed relativistic travel, or mission-grade shielding claim."),
    ("02_tidegill-carbon-cycle.png", "TIDEGILL", "Gill-inspired carbon-cycle contactor research", (6, 182, 212), "A lamellar counterflow contactor hypothesis compared with a conventional monolith.", ["Feed stream", "Lamellar contactor", "Capture medium", "Energy metering", "Regeneration", "Oxygen gate", "Carbon gate"], "Not a free-carbon or free-oxygen system. Each claim needs its own evidence gate."),
    ("03_nereid-common-safety-capsule.png", "NEREID", "Common protected capsule with separately qualified mobility kits", (34, 197, 94), "A protected capsule with standard interfaces for road, flight, water, and shallow-submersion studies.", ["Safety shell", "Pre-entry check", "Road kit", "Flight kit", "Water kit", "Submersion kit"], "Not a four-mode consumer vehicle. Each domain earns separate evidence."),
    ("04_glassreveal-selective-transparency-mobile.png", "GLASSREVEAL", "Selective-transparency mobile research study", (245, 158, 11), "An opaque phone architecture with a user-triggered optical reveal over a visible service cassette.", ["Front display", "Structural spine", "Service cassette", "RF / thermal", "Reveal laminate", "Visible zone"], "Not a fully transparent phone or a certification claim."),
    ("05_solarscreen-serviceable-bipv-facade.png", "SOLARSCREEN", "Serviceable BIPV vision-façade research programme", (234, 179, 8), "A patterned photovoltaic vision panel that separates long-lived glazing from serviceable electronics.", ["Exterior glazing", "Patterned PV", "Vision zones", "Edge routing", "Mullion cassette", "Information layer"], "Not a clear solar window or an unmetered media façade."),
    ("06_transistormesh-locality-tile.png", "TRANSISTORMESH", "Locality-and-guard-band accelerator tile hypothesis", (236, 72, 153), "A process-portable implementation method using trace-guided locality and power-delivery guard bands.", ["Workload traces", "Compute clusters", "Local memory", "Segmented fabric", "PDN guard bands", "Matched baseline"], "Not a new transistor or a universal processor claim."),
    ("07_horizon-weave-portal-topology-lab.png", "HORIZON-WEAVE", "Portal-topology theory lab with an explicit no-build gate", (100, 116, 139), "A bounded general-relativity study of prescribed toy geometries with controls and a constraints ledger.", ["Metric inputs", "Symbolic derivation", "NEC diagnostic", "Finite sweep", "Controls", "Constraint ledger", "No-build gate"], "Does not create a portal, black hole, white hole, or transport device."),
    ("08_mycoclean-contained-plastic-recovery.png", "MYCO-CLEAN", "Contained plastic-recovery platform", (16, 185, 129), "A closed-loop sorting, pretreatment, enzyme-reactor, and product-recovery platform.", ["Collection", "Identification", "Pretreatment", "Closed biocatalysis", "Product recovery", "Residue checks", "Recycle loop"], "No environmental release of engineered fungi or uncontained biology."),
    ("09_melshield-radiation-management.png", "MEL-SHIELD", "Bio-inspired radiation-management material research", (168, 85, 247), "A nonliving multilayer coupon combining melanin-inspired material with conventional shielding layers.", ["Incident spectrum", "Structural layer", "Hydrogen-rich", "Melanin composite", "Neutron layer", "Dosimetry"], "Does not destroy radioactive nuclei or authorize human deployment."),
    ("10_geno-aquatic-symbolic-teaching-sandbox.png", "GENO-AQUATIC", "Symbolic aquatic-trait teaching sandbox", (14, 165, 233), "A research-literacy package for fictional, symbolic trait hypotheses using synthetic labels only.", ["Synthetic candidate", "Schema", "Red-line validator", "Trait map", "Evidence notes", "Safe output"], "No biological sequences, organism-specific design, or release plan."),
    ("11_neuroforge-neuroregenerative-research-twin.png", "NEUROFORGE", "Neuro-regenerative research twin", (56, 189, 248), "A safety-constrained evidence twin for comparing neuro-regenerative research strategies.", ["Disease profile", "Model registry", "Evidence graph", "Candidate compare", "Safety gates", "Human review"], "Research use only: not a treatment, dosing tool, or patient recommendation engine."),
]


def wrap(draw: ImageDraw.ImageDraw, text: str, font: ImageFont.FreeTypeFont, width: int) -> list[str]:
    lines: list[str] = []
    current = ""
    for word in text.split():
        candidate = f"{current} {word}".strip()
        if draw.textbbox((0, 0), candidate, font=font)[2] <= width:
            current = candidate
        else:
            if current:
                lines.append(current)
            current = word
    if current:
        lines.append(current)
    return lines


def text_block(draw: ImageDraw.ImageDraw, xy: tuple[int, int], text: str, font: ImageFont.FreeTypeFont, fill: tuple[int, int, int], width: int, gap: int = 6) -> None:
    x, y = xy
    line_height = draw.textbbox((0, 0), "Ag", font=font)[3] + gap
    for index, line in enumerate(wrap(draw, text, font, width)):
        draw.text((x, y + index * line_height), line, font=font, fill=fill)


def arrow(draw: ImageDraw.ImageDraw, start: tuple[int, int], end: tuple[int, int]) -> None:
    draw.line((*start, *end), fill=LINE, width=4)
    angle = math.atan2(end[1] - start[1], end[0] - start[0])
    size = 15
    points = [
        end,
        (end[0] - size * math.cos(angle - math.pi / 6), end[1] - size * math.sin(angle - math.pi / 6)),
        (end[0] - size * math.cos(angle + math.pi / 6), end[1] - size * math.sin(angle + math.pi / 6)),
    ]
    draw.polygon(points, fill=LINE)


def render(filename: str, title: str, subtitle: str, accent: tuple[int, int, int], summary: str, steps: list[str], boundary: str) -> None:
    image = Image.new("RGB", (W, H), BG)
    draw = ImageDraw.Draw(image)
    draw.rounded_rectangle((50, 40, 1550, 190), radius=26, fill=PANEL, outline=accent, width=4)
    draw.text((82, 64), title, font=TITLE, fill=WHITE)
    draw.text((84, 126), subtitle, font=REG, fill=MUTED)

    draw.rounded_rectangle((50, 215, 1550, 345), radius=24, fill=PANEL_2, outline=LINE, width=3)
    draw.text((80, 238), "RESEARCH CONCEPT", font=TAG, fill=accent)
    text_block(draw, (80, 274), summary, REG, WHITE, 1430, 5)

    columns = 3
    box_width, box_height = 440, 130
    x_positions = [70, 580, 1090]
    for index, step in enumerate(steps):
        row, column = divmod(index, columns)
        x, y = x_positions[column], 385 + row * 175
        draw.rounded_rectangle((x, y, x + box_width, y + box_height), radius=22, fill=PANEL, outline=accent, width=3)
        draw.ellipse((x + 18, y + 18, x + 60, y + 60), fill=accent)
        draw.text((x + 39, y + 39), str(index + 1), font=TAG, fill=BG, anchor="mm")
        text_block(draw, (x + 76, y + 28), step, HEAD, WHITE, 335, 4)
        if index < len(steps) - 1:
            next_row, next_column = divmod(index + 1, columns)
            if next_row == row:
                arrow(draw, (x + box_width + 8, y + box_height // 2), (x_positions[next_column] - 12, y + box_height // 2))
            else:
                arrow(draw, (x + box_width // 2, y + box_height + 6), (x + box_width // 2, y + 162))

    draw.rounded_rectangle((50, 820, 1550, 960), radius=24, fill=(30, 20, 28), outline=accent, width=4)
    draw.text((80, 842), "CLAIM / SAFETY BOUNDARY", font=TAG, fill=accent)
    text_block(draw, (80, 880), boundary, REG, WHITE, 1420, 5)
    image.save(OUT / filename, optimize=True)
    image.save(PUBLIC_OUT / filename, optimize=True)


for filename, title, subtitle, accent, summary, steps, boundary in CONCEPTS:
    render(filename, title, subtitle, accent, summary, steps, boundary)

manifest = [{"file": filename, "title": title, "subtitle": subtitle} for filename, title, subtitle, *_ in CONCEPTS]
(OUT / "manifest.json").write_text(json.dumps(manifest, indent=2), encoding="utf-8")
(PUBLIC_OUT / "manifest.json").write_text(json.dumps(manifest, indent=2), encoding="utf-8")
print(f"Generated {len(CONCEPTS)} concept images in {OUT}")
