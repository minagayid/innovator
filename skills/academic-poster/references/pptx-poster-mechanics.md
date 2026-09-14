# pptxgenjs mechanics for posters

Read this alongside `/mnt/skills/public/pptx/SKILL.md` — everything there about colors, shadows,
icons, charts, and QA still applies. This file only covers what's different because a poster is
one slide at true physical size instead of a 10"×5.625" or 13.3"×7.5" deck canvas.

## Size table (mm → inches, `in = mm / 25.4`)

| Size | Width (in) | Height (in) |
|---|---|---|
| A0 portrait (default) | 33.11 | 46.81 |
| A0 landscape | 46.81 | 33.11 |
| A1 portrait | 23.39 | 33.11 |
| A1 landscape | 33.11 | 23.39 |
| A2 portrait | 16.54 | 23.39 |
| US standard (36×48) | 36.00 | 48.00 |

All fit within PowerPoint's own slide-size ceiling (~56" on the longest edge) — no need to build
small and scale up.

## Defining the custom layout

Set this once, before adding the single slide:

```javascript
const pptxgen = require("pptxgenjs");
const pres = new pptxgen();

// A0 portrait — swap numbers per the size table above for other sizes/orientations
pres.defineLayout({ name: "POSTER_A0_PORTRAIT", width: 33.11, height: 46.81 });
pres.layout = "POSTER_A0_PORTRAIT";

const slide = pres.addSlide();
// ...place content at true physical coordinates, same API as any other pptxgenjs slide
```

Everything else — `addText`, `addImage`, `addShape`, `addChart` — works exactly as documented in
the pptx skill, just with much larger `x`/`y`/`w`/`h`/`fontSize` values. Font sizes for a poster
(54–72pt headline, 24–28pt body) are well within pptxgenjs's normal range; nothing special is
needed there.

## QR code

Generate the QR as a PNG (e.g. via the `qrcode` npm package, or any QR-generation approach
available in the environment) and insert it like any other image:

```javascript
slide.addImage({
  path: "/path/to/qr.png",   // or data: "image/png;base64,..."
  x: 22.5, y: 40.5, w: 3.0, h: 3.0   // keep at least 2.5" square at A0 so it stays scannable
});
```

Put a short human-readable URL or DOI directly beneath the QR code as text — some visitors will
type it rather than scan it, and it's a fallback if the printed QR ends up too small or low-
contrast to scan reliably.

## Rendering for QA at poster scale

Use the pptx skill's standard conversion:

```bash
python scripts/office/soffice.py --headless --convert-to pdf output.pptx
pdftoppm -jpeg -r 150 output.pdf slide
```

Because the canvas is much larger than a slide, a single rendered image shrunk to fit a normal
view will hide small-text overflow — the exact defect most worth catching. After the initial
render, crop the full-resolution image into quadrants (e.g. with `Pillow` in Python) and inspect
each quadrant at full resolution before signing off, rather than eyeballing the whole poster at
once.
