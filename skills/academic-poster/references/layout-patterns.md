# Layout patterns — grid math

All measurements assume a 1" margin on every edge at A0 (33.1 × 46.8"); scale margins
proportionally for other sizes (roughly 0.7" at A1). Coordinates below are inches from the
top-left corner, ready to drop into `pptxgenjs` `x`/`y`/`w`/`h` options. A0 portrait is used as
the reference size in every example; for A0 landscape swap width/height; for A1 scale all
numbers by 0.706 (23.4/33.1).

## Pattern 1 — Classic IMRaD grid (A0 portrait, 33.1 × 46.8")

Four horizontal bands stacked top to bottom, each full-width:

| Band | y | h | Content |
|---|---|---|---|
| Header | 1.0 | 4.5 | Title, authors, affiliations, logo (right-aligned) |
| Intro/Background | 6.0 | 6.0 | 2–3 sentence motivation, split into 2 columns if long |
| Methods | 12.5 | 9.0 | Flowchart or diagram spanning full width, short caption below |
| Results | 22.0 | 16.0 | Largest band — dominant figure/table left (~60% width), key stats large-format right (~40%) |
| Conclusion + refs + contact | 39.0 | 6.8 | Split into 3 columns: conclusion, compact references, contact/QR |

Column width for two-column splits: `(31.1 - 0.5 gutter) / 2 = 15.3"` each, starting at
`x = 1.0` and `x = 16.8`.

## Pattern 2 — Single-message "headline" layout (A0 portrait)

| Element | x | y | w | h | Notes |
|---|---|---|---|---|---|
| Formal title (small) | 1.0 | 1.0 | 31.1 | 1.5 | 36–44pt, understated |
| Authors/affiliations/logo | 1.0 | 2.6 | 31.1 | 1.2 | 20–24pt |
| **Headline finding** | 1.0 | 4.2 | 31.1 | 5.0 | 60–72pt bold, the visual anchor of the whole poster |
| Dominant figure | 1.0 | 10.0 | 20.0 | 18.0 | One large, high-quality visual — this carries the results |
| Supporting stat callouts | 22.0 | 10.0 | 10.1 | 18.0 | 2–3 large numbers (48–60pt) with short labels, stacked |
| Compact method/context note | 1.0 | 29.0 | 20.0 | 6.0 | A few short lines only — this pattern trims text aggressively |
| Conclusion | 1.0 | 36.0 | 20.0 | 4.0 | One or two sentences |
| QR + contact + refs | 22.0 | 29.0 | 10.1 | 11.0 | QR code sized at least 2.5" square to stay scannable from a normal viewing distance |

## Pattern 3 — Visual flow / dashboard (A0 portrait)

A numbered horizontal or vertical pipeline of equal-sized blocks (icon + stat + short label),
e.g. 4 stages down the page:

| Stage | y | h |
|---|---|---|
| Header (title/authors) | 1.0 | 4.0 |
| Stage 1 block | 6.0 | 8.5 |
| Stage 2 block | 15.0 | 8.5 |
| Stage 3 block | 24.0 | 8.5 |
| Stage 4 block / outcome | 33.0 | 8.5 |
| Footer (refs/contact/QR) | 42.0 | 3.8 |

Each block: icon in a colored circle on the left (~4" diameter), stage number + short header,
one large stat or short outcome sentence, connected to the next block by whitespace or a subtle
arrow — never a decorative stripe (see pptx skill's "avoid" list, which applies here too).

## General rules across all three patterns

- Never mix patterns on one poster — pick one and commit; a poster that's half headline-style
  and half dense IMRaD reads as unfinished.
- Leave at least 0.3–0.5" of whitespace between every block — posters read worse than slides
  when content is packed edge-to-edge, because viewers are standing further back.
- The dominant figure (whichever pattern) should occupy noticeably more area than any other
  single element — if two figures are the same size, neither reads as the main result.
