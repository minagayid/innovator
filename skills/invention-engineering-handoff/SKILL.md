---
name: invention-engineering-handoff
description: Turn an invention concept or visual package into a traceable engineering handoff with requirements, architecture, component register, tentative dimensions, bill of materials, verification plan, and unresolved-risk ledger. Use when moving from concept render toward design review, prototyping, sourcing, or testing.
---

# Invention Engineering Handoff

Turn an invention concept into a structured engineering brief that another engineer can evaluate and challenge. This skill organizes the handoff; it does not replace domain analysis, calculation, standards review, or physical testing.

## Boundaries

- Separate **user requirements**, **design decisions**, **assumptions**, and **verified results**.
- Label nontrivial information **Supplied**, **Sourced**, **Derived**, **Proposed**, or **Unresolved**. Cite sources for sourced values and show the inputs/calculation for derived values.
- A visual estimate is not a manufacturing dimension. A plausible BOM is not supplier-qualified. A functional diagram is not proof of performance.
- For regulated or high-risk domains (including medical products, drinking-water treatment, electrical safety, lifting, transport, energy storage, biological systems, and child products), list specialist, standards, risk, and test gates. Do not make efficacy, potable-water, safety, or compliance claims without evidence.
- For substantive physics, quantitative performance, research uncertainty, safety, or prior-art questions, route to `bounded-invention-engineering` and `invention-validation-lab`.

## Workflow

1. **Freeze the concept version.** Record name, revision, purpose, user/environment, operating principle, and exclusions.
2. **Translate intent into requirements.** Give each requirement a stable ID, priority, measurable acceptance condition where feasible, source/status, and verification method. Flag unmeasurable requirements.
3. **Decompose the architecture.** List assemblies and interfaces; describe material, energy, data, fluid, and motion paths as relevant. Add a block diagram and operating sequence.
4. **Establish dimensional control.** Define units, orientation, coordinate conventions, and datum. Mark every dimension as supplied, sourced, derived, proposed estimate, or unresolved. Do not invent tolerances without manufacturing context.
5. **Draft component register and BOM.** Record purpose, critical interfaces, candidate material/part family, serviceability, procurement status, and uncertainty. Distinguish candidate from selected items.
6. **Review failure and maintenance paths.** Identify foreseeable failure modes, safe state, inspection points, replacement intervals to be established, service access, waste, and fault recovery. Use formal FMEA or hazard analysis where warranted.
7. **Build a verification matrix.** For each requirement, specify test/analysis/inspection/demonstration method, conditions, equipment/data, threshold, evidence artifact, and owner. Include negative tests and off-nominal conditions when material.
8. **Plan a staged prototype.** Separate paper review, CAD/layout checks, bench proof of principle, integrated prototype, environmental testing, pre-compliance review, and regulated evaluation. Test the most consequential assumption with the smallest reversible experiment first.
9. **Maintain a proof-gap ledger.** Record evidence that could invalidate the concept and the next action. Do not call a system validated unless the declared criteria have passed in the stated regime.
10. **Handoff for review.** Use the templates under `templates/`. Highlight decisions needed from the user or specialists and give a short prioritized next-step plan.

## Expected deliverables

Adapt to the invention, but normally include a concept summary/version; requirements and verification matrix; architecture and interfaces; component register/BOM; dimensions and assumptions table; operating/fault sequence; verification, safety, and regulatory gates; proof-gap ledger; and next prototype step.

## Completion gates

- Requirements are distinct from marketing benefits.
- Component names and IDs match across text, diagrams, and BOM.
- Every quantitative value has units and provenance/status.
- Critical assumptions have a falsification or test path.
- Safety/compliance questions have an owner or remain explicitly unresolved.
- Visual polish has not upgraded an unsupported claim.

## Related skills

- `invention-visual-package` creates the coordinated visual asset set.
- `patent-figure-preparation` organizes patent-oriented draft figures and consistency checks.
- `bounded-invention-engineering` supports quantitative model/test work.
- `invention-validation-lab` supports prior-art boundaries and kill/continue/reframe decisions.
