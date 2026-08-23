---
name: bounded-invention-engineering
description: Convert ambitious invention concepts into auditable, reproducible research workspaces. Use when designing speculative energy, propulsion, climate, mobility, hardware, or cross-domain systems that need bounded physics models, negative controls, diagrams or renders, manufacturing/test gates, honest proof-gap ledgers, repository integration, or a static publication companion.
---

# Bounded Invention Engineering

Use this skill to replace broad invention claims with **testable mechanisms and reversible first articles**. Treat every numerical result as finite evidence, not proof of safety, novelty, certification, or commercial readiness.

## Workflow

1. **Freeze the claim boundary.** State the physical system, intended environment, exclusions, conservation laws, and prohibited claims. Use the evidence labels in `references/claim-boundaries.md`.
2. **Collect constraints.** Use primary sources for governing physics, relevant regulation, and current deployment limits. Record URLs and the precise consequence for the design.
3. **Formulate the first falsifiable mechanism.** Identify one measurable causal claim, an explicit baseline, a negative control, pass conditions, and a condition that falsifies the design.
4. **Write the model specification before code.** Use `templates/MODEL_SPEC_TEMPLATE.md`. Specify units, inputs, numerical method, output files, resolution check, controls, and proof gaps.
5. **Implement deterministic finite models.** Save source, machine-readable summary, plots, and a regeneration command. Never hide assumptions in a render or hard-code a passing output.
6. **Run adversarial validation.** Include a meaningful negative control, parameter or time-step sensitivity, boundary cases, and a regression test. Inspect generated plots. Record any correction before proceeding.
7. **Create technical visuals.** Prefer Mermaid or D2 for systems, interfaces, state machines, and qualification sequences. Generate concept renders only for bounded first test articles; caption them as non-fabrication design references.
8. **Create the build and qualification pathway.** Separate laboratory modules, prototype articles, manufacturing processes, and any regulated deployment. Do not collapse them into a single readiness statement.
9. **Integrate and publish honestly.** Link source, model specification, outputs, visual assets, and limitations from the repository/site. For static hosts, generate a companion archive; do not deploy an SSR/API application as if static hosting supports it.
10. **Deliver the proof-gap ledger.** State exactly what a passing model does not establish and name the next physical test.

## Required artifacts

Create a workspace with this minimum structure, adjusting names for the project.

```text
invention/
├── README.md
├── REFINED_DESIGN.md
├── simulation/
│   ├── MODEL_SPEC.md
│   ├── model.py
│   ├── test_model.py
│   ├── outputs/
│   └── EXTERNAL_CONSTRAINTS_LEDGER.md
├── schematics/
│   ├── architecture.mmd
│   ├── state_machine.mmd
│   └── qualification_sequence.mmd
└── assets/
```

Run `python /home/ubuntu/skills/bounded-invention-engineering/scripts/check_workspace.py <workspace>` after creation. The checker is structural only; it cannot certify model validity.

## Model rules

Use SI units, declare every assumption, and serialize parameters with outputs. Include at least one baseline and one negative control. For dynamic calculations, run a resolution or time-step check. When finite fault matrices are used, enumerate the covered fault set and state every excluded class, especially common-cause and latent failures.

Do not use illustrative parameters as field-ready engineering values. Do not interpret a pass as an operating authorization, structural release, safety case, carbon-removal credit, mission feasibility, medical result, legal novelty finding, or regulatory compliance.

## Visual rules

Diagram what the system **does**, what it **denies**, and what it **cannot claim**. Keep cross-domain hardware as separate modules unless evidence supports integration. Verify generated diagrams and plots visually. Preserve diagram source with every rendered PNG.

## Static-publication rule

Before adding a GitHub Pages workflow, inspect the application runtime. GitHub Pages serves static artifacts only. If the project needs server-side rendering, APIs, authentication, a database, or server bindings, retain its runtime-capable deployment and publish a clearly labelled static companion archive rather than a broken clone. Read `references/publication-boundaries.md` when adding a Pages workflow.

## Completion gate

Do not call an invention “validated” unless the report says **what was validated**, under what finite conditions, by which versioned source, and what remains unresolved. A compelling render, a passing unit test, or an external link alone never closes the proof gap.
