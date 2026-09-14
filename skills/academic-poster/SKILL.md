---
name: academic-poster
description: Creates a print-ready, editable academic/scientific conference poster
  — a single custom-sized .pptx slide (not a slide deck) plus a print PDF — from a
  paper, abstract, or bullet-point research summary. Use whenever the user needs a
  poster for a conference, poster session, symposium, or research showcase, including
  phrases like "make me a poster," "poster for AIiH / a conference," "turn my abstract
  into a poster," "I'm presenting a poster," "poster board," or "best poster award."
  Trigger even if they only mention poster dimensions (A0/A1/A2), a poster session
  date, or a judged poster competition — they need this, not a slide deck. Defaults
  to A0 portrait when the venue hasn't specified a size, and applies AIiH's published
  poster-judging criteria (scientific quality, design, presentation delivery) as a
  general best-practice reference for any conference. Requires the pptx skill alongside
  it for pptxgenjs mechanics — read that SKILL.md too, same turn.
---

# Academic / Scientific Conference Poster

A conference poster is one giant canvas, not a slide deck: it has to work read from across a room (to pull someone over) AND from arm's length (to hold up under a 10-minute conversation with a judge). That dual job is why poster design has its own rules — much bigger type, one dominant visual, far less text than any slide — and why this skill exists separately from the pptx skill's deck-building guidance. Use both together: this skill covers poster-specific decisions (physical size, layout pattern, judging-informed structure, poster typography); `/mnt/skills/public/pptx/SKILL.md` covers the pptxgenjs mechanics (colors, shadows, icons, validation, rendering to images) that apply either way.

## Before designing anything: gather the essentials

Don't start placing text boxes until you have (ask only for what's genuinely missing — infer the rest from any paper/abstract the user gives you):

1. **Title, full author list, affiliations**, and any funding/grant acknowledgement.
2. **Venue** — conference name, and the poster session date if known.
3. **Physical size & orientation**, if the venue specifies one. If not (many conferences, including AIiH, don't publish a fixed board size on their site), default to **A0 portrait** and tell the user you're defaulting, with a nudge to confirm the actual board size with organisers closer to the date — venues sometimes share boards between two presenters, which halves the usable width.
4. **Source content** — a paper, abstract, or bullet points covering: motivation, methods, results (with real figures/data if available), and conclusion. If a file's been uploaded, read it (use the file-reading skill if it's not already in context) rather than asking the user to retype it.
5. **One-sentence headline finding** — the single takeaway a passer-by should walk away with, distinct from the paper's title. If the user hasn't articulated one, propose one from their content and confirm it — this sentence anchors the whole layout (see below).
6. **Figures/tables** — what exists already vs. what needs a placeholder. A poster lives or dies on one strong figure; don't let this slip to "TBD."
7. **Institutional/conference branding** — logo files, required brand colors, QR/contact preferences.

If the content is coming from an abstract written for a conference like AIiH's, note that the **archived abstract (the 5-page paper, deposited on Zenodo with a DOI) and the physical poster are two different deliverables** — the abstract is excellent raw material for the poster's content, but it is not itself the poster, and the poster isn't what gets the DOI. See `references/aiih-conventions.md` for the fuller picture, including AIiH's own poster-judging criteria and what its recent award winners worked on.

## Choosing size & orientation

| Size | mm | inches | Notes |
|---|---|---|---|
| **A0 portrait** (default) | 841 × 1189 | 33.1 × 46.8 | Most common international academic standard; use unless told otherwise |
| A0 landscape | 1189 × 841 | 46.8 × 33.1 | Only if the venue requires landscape |
| A1 | 594 × 841 | 23.4 × 33.1 | Common where boards are shared or space is tighter |
| A2 | 420 × 594 | 16.5 × 23.4 | Smaller poster sessions, virtual/print-at-home |
| US standard | 914 × 1219 | 36 × 48 | Common at US conferences instead of A0 |

Convert mm → inches with `mm / 25.4`. All of these fit comfortably within PowerPoint's own slide-size ceiling (~56" on the longest edge), so there's no need to scale down and blow up later — build at true physical size from the start. See `references/pptx-poster-mechanics.md` for the exact `pptxgenjs` setup.

## Pick one layout pattern — don't blend them

**1. Classic IMRaD grid** — columns or bands for Introduction / Methods / Results / Discussion. The safe default; reviewers and judges scanning quickly know exactly where to look for what. Best when the work is methodologically dense or the audience expects a traditional structure.

**2. Single-message "headline" layout** — the one-sentence key finding sits where the title would normally go, set in the largest type on the poster, with the formal title demoted to a small line above it. One dominant figure carries the results; supporting text is trimmed to a few short blocks; a QR code links out to the full paper/abstract for anyone who wants the detail. This format (popularized as the "Better Poster" approach) trades comprehensiveness for the thing a poster is uniquely good at: stopping someone mid-walk and starting a conversation. Best for applied/clinical work with one clear, presentable result.

**3. Visual flow / dashboard** — a numbered pipeline of stat callouts and icons (data → model → outcome), each block small and scannable. Best for pipeline-shaped work (a model trained and evaluated end-to-end) where the story is the flow itself.

**Recommended default**: a hybrid of #1 and #2 — lead with the one-sentence headline finding in large type near the top (this is what makes the poster work as a 30-second pitch and holds up under conversation, which is exactly what "presentation delivery" as a judging criterion rewards), then support it with a compact IMRaD backbone underneath (which is what "scientific quality" as a judging criterion rewards) and one dominant figure (which is what "poster design" as a judging criterion rewards). See `references/aiih-conventions.md` for where that three-part judging split comes from and why it maps cleanly onto this structure.

Full grid measurements and column math for each pattern at A0/A1 are in `references/layout-patterns.md`.

## Poster typography (much bigger than slide typography)

| Element | Size | Notes |
|---|---|---|
| Headline / key finding | 54–72pt bold | The one thing readable from across the room |
| Formal title (if demoted) | 36–44pt | Small relative to the headline in pattern #2 |
| Section headers | 32–40pt bold | |
| Body text | 24–28pt | Never smaller — this is the arm's-length reading distance floor |
| Captions / references / footer | 16–18pt muted | Keep the reference list short and compact; this is the one place small type is acceptable |

Rule of thumb: if someone would need to lean in to read it, the text is too small for a poster. Reuse the safe-font list from the pptx skill (Arial, Calibri, Cambria, Times New Roman, etc.) for anything where fit matters — the same font-substitution QA risk applies, just at a scale where overflow is even more visible.

## Color & branding

Apply the same palette principles as the pptx skill — one dominant color (60–70% of visual weight), 1–2 supporting tones, one sharp accent, chosen for the specific topic rather than a generic default — but a poster usually has a **hard external constraint the deck version doesn't**: an institutional or conference logo with its own brand colors. Get the logo file and any brand palette before choosing colors, and design around it rather than picking colors first and hoping the logo fits.

## Content checklist — don't ship a poster missing any of these

- Title, full author list, affiliations, funding acknowledgement if applicable
- The one-sentence headline finding, prominently placed
- Background/motivation — 2–3 sentences, not a literature review
- Methods — concise, visual where possible (a flowchart beats a paragraph)
- Results — one dominant figure or table with real data (or a clearly-marked placeholder), key numbers set large
- Conclusion/implications — short and punchy
- References — compact, small font, only what's essential
- Contact info and a QR code (email, personal site/GitHub, and the Zenodo DOI once assigned if the abstract is archived there)
- Required logo/branding placement per the venue's rules

## Building the .pptx

This is a single slide at true physical size, not a deck — read `/mnt/skills/public/pptx/SKILL.md` for the actual `pptxgenjs` mechanics (color hex format, shadow/gradient gotchas, icon rendering via react-icons, chart setup if you're charting results natively, and the required `validate.py` pass). The only poster-specific addition is the custom layout definition and size table in `references/pptx-poster-mechanics.md` — set that up first, before placing any content.

## QA — poster-specific, run every time

Do the pptx skill's standard QA (content check via `markitdown`, `validate.py`, and rendering to images), then add:

- **Read-from-a-distance check first.** At true poster scale, body text below ~24pt-equivalent is the single most common defect — check this before anything else.
- **No walls of unbroken paragraph text** — everything should read as short blocks or bullets, scannable in seconds.
- **One dominant visual, not several competing ones of equal size.** If there are multiple figures, one should clearly lead.
- **Margins scaled to the poster, not to slide defaults** — roughly 1" equivalent at A0 (scale proportionally for other sizes), on all four edges.
- **Render at high resolution and inspect by quadrant, not just one shrunk-down thumbnail** — a full A0 poster rendered small enough to fit a screen will hide exactly the small-text overflow you're checking for. Convert to PDF/image per the pptx skill's instructions, then crop or zoom into each quadrant before judging it clean.
- **QR code present, and pointed at the right URL** — the sandbox can't scan it, so tell the user to test-scan it themselves before printing.
- **Placeholder/lorem check** via the same `markitdown | grep` pass the pptx skill uses.

## Output

Deliver two files: the editable `.pptx` at true poster dimensions, and a print-ready PDF export (`scripts/office/soffice.py --headless --convert-to pdf`, from the pptx skill) — most print shops and venues want the PDF, but the user will want the editable source too for any last-minute changes. Present both.

## Reference files

- `references/layout-patterns.md` — grid measurements and column math for all three layout patterns, at A0 and A1
- `references/aiih-conventions.md` — what AIiH specifically publishes (and doesn't) about poster format, its poster-judging criteria, the abstract/Zenodo relationship, and context on recent award winners
- `references/pptx-poster-mechanics.md` — the exact `pptxgenjs` custom-layout setup, the full mm/inch size table, and a QR-code insertion snippet
