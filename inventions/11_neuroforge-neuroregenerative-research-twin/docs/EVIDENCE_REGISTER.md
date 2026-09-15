# Evidence register

## Evidence labels

| Label | Meaning |
|---|---|
| `approved_clinical` | Authorized for a defined indication (must be verified) |
| `clinical_investigational` | Human study evidence; not established treatment |
| `preclinical` | Animal or laboratory evidence |
| `in_vitro` | Human-cell, organoid, barrier, or other laboratory model |
| `computational` | Modeling or in-silico inference |
| `hypothesis` | Mechanistically proposed, insufficiently validated |
| `unknown` | Insufficient or unverifiable evidence |

Each record needs source URL, publication date, study type, **source kind**,
disease context, model limitations, endpoint, uncertainty, reviewer, and
retrieval timestamp. `study_type` describes study design; `source_kind`
distinguishes a peer-reviewed article from a conference abstract, press release,
guideline, review, registry, preprint, or synthetic fixture.

## Evidence anchors (non-exhaustive)

- **Active V1 evidence:** investigational iPSC-derived dopaminergic cell
  replacement in Parkinson disease:
  https://www.nature.com/articles/s41586-025-08700-0. This is a single-centre,
  open-label Phase I/II study. Seven participants contributed to safety
  assessment and six to efficacy assessment over 24 months. The paper reports
  no serious adverse events or tumor-like graft overgrowth, and 73 adverse
  events (72 mild and one moderate dyskinesia event). Four of six efficacy
  participants improved on the MDS-UPDRS part III OFF score; these were
  secondary outcomes in a small, open-label, uncontrolled trial. They do not
  establish efficacy, disease modification, or general safety for other cell
  products.
- **Preliminary V1 context only:** ISSCR Parkinson conference update:
  https://www.isscr.org/isscr-news/new-clinical-data-presented-at-isscr-2026-advance-stem-cell-based-cell-therapy-for-parkinsons-disease.
  Treat as a conference-related report, not a full peer-reviewed trial report.
- Neural organoid bioelectronic monitoring review:
  https://www.nature.com/articles/s41378-025-01038-7
- **Out of V1 scope:** the 2026 first-in-human spinal-cord-injury neural
  progenitor study (https://www.nature.com/articles/s41591-026-04549-6) concerns
  a different disease, cell product, anatomy, and endpoints. Do not connect it
  to Parkinson candidate rankings or transfer its safety findings. It may be
  considered only in a separately reviewed future SCI module.
- **Guideline source:** cite the current ISSCR guideline version directly at
  https://www.isscr.org/guidelines. ISSCR identifies version 1.2 (August 2025);
  the targeted 2025 update was limited to stem-cell-based embryo models. The
  conference/news page is not itself a guideline document.

These anchors support research direction and early feasibility only. Keep
preliminary reports typed as such, and do not infer universal efficacy,
approval, disease modification, or clinical readiness.
