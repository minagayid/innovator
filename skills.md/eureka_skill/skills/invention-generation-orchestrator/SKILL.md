---
name: invention-generation-orchestrator
description: Orchestrate research-grounded generation of original ideas, hypotheses, equations, theories, products, and inventions. Use when a request asks to connect knowledge across fields, discover a mechanism, propose a breakthrough, or turn research gaps into testable innovation candidates.
---

# Invention Generation Orchestrator

Use this skill as the program-level coordinator for invention work. Treat an invention as a **mechanism plus evidence, constraints, and a decisive test**, not as a clever name or a desirable outcome. Do not replace domain specialists; route to them and preserve their uncertainty labels.

## Route the request

1. **Frame the opportunity.** State the target user or system, unmet need, desired effect, current failure, constraints, safety boundary, time horizon, and success metric. Define what would count as a meaningful improvement or breakthrough.
2. **Architect the research.** Call `frontier-research-architect` to map functions, bottlenecks, prior art, adjacent fields, data gaps, and competing explanations. Use `research-synthesis-hypothesis` when external literature or data is material.
3. **Expand and mine contradictions.** Call `critical-creative-thinking` for interpretation and adversarial framing. Call `contradiction-mechanism-lab` to expose trade-offs, hidden assumptions, and functions that must coexist.
4. **Recombine mechanisms.** Call `cross-domain-recombination` to transfer mechanisms from structurally analogous fields. Require at least three candidates with distinct causal stories; mark speculative leaps.
5. **Formalize the strongest candidates.** Call `conjecture-formalization-lab` for equations, algorithms, invariants, system models, or falsifiable propositions. Use `advanced-mathematics-computation` when symbolic, numerical, exhaustive, or proof-gap work is needed. Before computation, freeze the baseline, metric, units, parameter/data policy, reproducibility manifest and stop condition.
6. **Validate and rank.** Call `invention-validation-lab` to search the prior-art boundary, attack assumptions, assess feasibility and safety, and design the smallest decisive test. For simulation-dependent ranking, record verification, validation, uncertainty and independent-check status.
7. **Synthesize without overclaiming.** Select a candidate only when its mechanism, evidence, falsifier, baseline, and next action are explicit. Preserve rejected candidates and unresolved branches.
8. **Deliver the handoff.** Use [invention-program.md](templates/invention-program.md). Label every statement as observed, sourced, inferred, proposed, simulated, or unresolved.

## Historical-breakthrough pattern

Ask whether the work contains the recurring sequence **anomaly or need → reframing → mechanism → enabling tool → prototype → decisive validation → scaling**. Use this as a design prompt, not as evidence that the result is historically comparable or novel.

## Stop gates

Stop and ask for clarification when the target, constraints, or approval boundary is missing. Stop before calling an idea novel, correct, safe, patentable, or commercially viable. Require a bounded search, explicit assumptions, and an experiment or derivation that could fail. For irreversible actions, return a proposal and approval gate rather than acting.

## Handoff contract

Pass: objective; system boundary; evidence ledger; source links; assumptions; constraints; candidate mechanisms; baseline; requested operation; output format; falsification condition; reproducibility/VVUQ status where applicable; and stop condition. Receive the same fields plus versioned artefact locations, provenance and confidence. Use one level of handoff at a time; do not bury critical assumptions in a reference file.

## Quality rubric

Rank candidates on mechanism clarity, non-obvious structural connection, evidence quality, falsifiability, feasibility, safety, reversibility, learning value, and distance from known prior art. A high score in originality never compensates for an undefined mechanism or an untestable claim.
