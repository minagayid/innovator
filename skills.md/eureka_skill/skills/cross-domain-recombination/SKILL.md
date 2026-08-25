---
name: cross-domain-recombination
description: Generate invention candidates by transferring mechanisms across distant domains and recombining them under explicit constraints. Use when a problem needs non-obvious analogies, interdisciplinary synthesis, or alternatives beyond the dominant field’s design space.
---

# Cross-Domain Recombination

Use this skill to search for **structural analogies**, not superficial resemblance. Transfer the relation among components, flows, constraints, and feedbacks; then re-derive the mechanism in the target domain.

## Workflow

1. **Specify the target bottleneck.** Record the function, failure mode, operating regime, constraints, and baseline. Define which outcome must change.
2. **Extract the target structure.** Represent the problem as entities, flows, state variables, transformations, feedbacks, invariants, and control points.
3. **Search adjacent mechanisms.** Query neighboring fields by function and mechanism: biology, physics, chemistry, computation, ecology, manufacturing, logistics, economics, social systems, and historical engineering. Prefer sources that expose operation, not only outcomes.
4. **Build a transfer matrix.** For each source, compare causal structure, governing constraints, scale, environment, failure modes, materials/information, and observables. Mark each element as transferred, compensated, excluded, or unresolved.
5. **Re-derive candidates.** Create at least three candidates using one of: mechanism substitution, composition, inversion, scale change, representation change, phase separation, adaptive control, or lifecycle coupling. State the target-domain causal chain and the new compensating element for every non-transfer.
6. **Run conservation and feasibility checks.** Check dimensions, energy/material/information accounting, latency, manufacturability, maintenance, safety, and stakeholder fit. Design an anti-analogy negative control that removes a critical transferred condition. Reject analogies that rely on an untransferred hidden condition.
7. **Define signatures.** For each candidate, state the non-obvious prediction, baseline comparison, falsifier, and smallest test. Send the strongest candidates to `conjecture-formalization-lab` and `invention-validation-lab`.

## Anti-analogy rule

Similarity of shape, vocabulary, or aspiration is insufficient. A transferred mechanism is credible only when the source and target share a causal relation or when the differences are explicitly compensated by a new design element.

## Output

Use [recombination-portfolio.md](templates/recombination-portfolio.md). Include source mechanism, transfer matrix, transferable relation, non-transferable conditions, compensating design elements, candidate design, predicted signature, anti-analogy control, feasibility risks, evidence status, and next test.
