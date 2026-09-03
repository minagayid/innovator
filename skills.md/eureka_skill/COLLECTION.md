# `eureka_skill` Collection Charter

**Collection version:** `2026.09.03-v2`
**Repository path:** [`skills.md/eureka_skill/`](./)
**Installable package path:** [`skills.md/eureka_skill/skills/`](./skills/)

> **Purpose.** `eureka_skill` is an evidence-first collection for advanced mathematics, innovation research, formalization, design-space exploration, and computational studies. It coordinates reusable skills; it does not certify a theorem, physical design, safety case, patentability, commercial viability, or access to supercomputer resources.

The collection operationalizes a deliberately strict distinction: **verification** asks whether an implementation solves its specified equations or algorithm; **validation** asks whether the model adequately represents an external target in a stated regime; and **uncertainty quantification** characterizes how uncertainty affects conclusions. These are distinct activities, and a reproducible run is not by itself a correct or physically valid result.[1] [2]

| Layer | Included packages | Core role |
|---|---|---|
| Research framing | `critical-creative-thinking`, `research-synthesis-hypothesis`, `frontier-research-architect` | Define claims, collect evidence, expose assumptions, and map opportunity gaps. |
| Mechanism discovery | `innovation-breakthrough-design`, `contradiction-mechanism-lab`, `cross-domain-recombination`, `invention-generation-orchestrator` | Generate causal candidates with baselines, constraint accounting, transfer checks, and falsifiers. |
| Formalization and invention validation | `conjecture-formalization-lab`, `invention-validation-lab`, `bounded-invention-engineering` | Turn claims into bounded models and kill/continue/reframe decisions. |
| Mathematics and high-integrity computation | `advanced-mathematics-computation`, `math-research-orchestrator`, `eureka-computational-lab`, `eureka-design-space-lab`, `eureka-formal-logic-lab` | Route theorem-aware computation, VVUQ studies, constrained trade-offs, finite/exhaustive evidence, and proof-gap reporting. |
| Debate and adversarial review | `adversarial-peer-review` | Apply evidence-based attacks, concrete repairs, bounded re-review, residual-risk tracking, and reversal criteria. |
| Collection router | `eureka-skill` | Expose the user-facing **eureka_skill** route and select the minimum sufficient specialist workflow. |

## Non-negotiable evidence contract

Every material result must state its evidence label: **sourced, computed, inferred, proposed, or unresolved**. Computational work must preserve a versioned specification, source/environment/input/seed/output provenance, meaningful baseline and negative control, sensitivity or refinement where applicable, machine-readable output, regression checks, and a decision stop or reversal condition. Formal and finite studies must state the exact domain, coverage argument, trusted base, counterexample strategy, and remaining proof obligations.

| Validation performed for this release | Result |
|---|---|
| Official structural validation | All **17** packages passed `quick_validate.py`. |
| New computation validator | Accepted a complete 10-section sample and rejected a deliberately incomplete sample. |
| New design-space validator | Accepted a complete 9-section sample after normalizing punctuation in headings. |
| New formal-logic validator | Accepted a complete 9-section finite-claim sample. |
| Adversarial review validator | Accepted a complete review report and rejected a deliberately incomplete report. |

The validators are **structural checks only**. They do not establish mathematical truth, domain coverage, a correct solver encoding, physical model validity, or engineering readiness.

## Package layout

Each child under [`skills/`](./skills/) is an independently installable skill package with its own `SKILL.md` and only necessary templates, scripts, and references. Collection-level documentation stays outside those packages to retain a clean installation surface.

## References

[1] [Yeo, *A Summary of Industrial Verification, Validation, and Uncertainty Quantification Procedures in Computational Fluid Dynamics*, NISTIR 8298 (2020).](https://www.nist.gov/publications/summary-industrial-verification-validation-and-uncertainty-quantification-procedures)

[2] [Coveney, Groen and Hoekstra, “Reliability and reproducibility in computational science,” *Philosophical Transactions of the Royal Society A* (2021).](https://royalsocietypublishing.org/rsta/article/379/2197/20200409/111837/Reliability-and-reproducibility-in-computational)

[3] [Wilson et al., “Best Practices for Scientific Computing,” *PLOS Biology* (2014).](https://pmc.ncbi.nlm.nih.gov/articles/PMC3886731/)
