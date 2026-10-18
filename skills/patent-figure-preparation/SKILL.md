---
name: patent-figure-preparation
description: Prepare a consistent draft figure set and review checklist for discussion with patent counsel, including perspective, orthographic, sectional, exploded, detail, and functional figures. Use when a user asks for patent drawings, registration images, application figures, or a patent-oriented figure register.
---

# Patent Figure Preparation

Prepare a consistent **draft figure set** for an invention disclosure or patent-professional handoff. This skill does not determine legal novelty, patentability, filing sufficiency, or entitlement to protection.

## Boundaries

- Distinguish concept art, engineering drawings, and formal patent drawings. A polished visual is not automatically an acceptable filing figure.
- Do not call drawings “patent-ready,” compliant, novel, or registrable unless the applicable requirements and actual drawings have been reviewed by qualified people.
- Requirements vary by jurisdiction, application type, office practice, and filing route. For a real filing, consult current official guidance for the named jurisdiction and application type.
- Separate appearance-focused design protection from utility protection of technical features, processes, systems, and operation. Clarify the route only when it materially changes the figure plan.
- Do not promise claim scope or provide a legal novelty conclusion. Claim drafting and filing strategy require qualified patent counsel.

## Workflow

1. **Freeze the embodiment.** Capture the working name, proposed mechanism, parts and interfaces, variants, exclusions, and evidence status. Keep the disclosure and visuals aligned.
2. **Record filing context.** Note jurisdiction, application type, intended use of drawings, any provided description/claims, and known sheet or format constraints. If these are unknown and the user wants a concept set, label it a general discussion draft.
3. **Plan figures.** Choose views that explain the invention. A typical utility-oriented plan may include a complete perspective view, orthographic views, a section/cutaway, an exploded assembly, a critical detail, and a flow/sequence diagram when relevant. This is a planning example, not a universal filing requirement. For appearance-focused protection, prioritize disclosure of the ornamental design.
4. **Assign stable reference numerals first.** Maintain one figure register. Keep every numeral and component name consistent across all figures and the written description. Do not let image generation invent, shift, or renumber them.
5. **Produce formal-style line art.** Favor clear monochrome outlines, unambiguous views, readable leaders, and figure labels. Remove marketing scenery, decorative gradients, and irrelevant UI unless appropriate for the specific office and figure purpose. Use generated renders only as guides; redraw or verify important geometry and labels with precise vector/CAD tools.
6. **Coordinate views.** Check geometry, orientation, section plane, hatching, hidden/visible edges, assembly sequence, scale assumptions, interfaces, and reference numerals. Cutaway and exploded views must show the same embodiment.
7. **Check support.** Map each important described feature to one or more figures. Flag material features not adequately illustrated and details shown in an image but not present in the description. Do not invent features to strengthen a possible claim.
8. **Run readiness checks.** Use [figure-readiness-checklist.md](references/figure-readiness-checklist.md). Pending items must remain pending, with an owner or next action.
9. **Prepare a handoff.** Include the register, numbered draft figures, embodiment description, open drawing issues, links to official procedural guidance reviewed, and a statement that formal requirements remain subject to counsel/office review.
10. **Preserve uncertainty.** Figures communicate a concept; they do not establish novelty, enablement, manufacturability, safety, or patentability.

## Expected outputs

- Figure register including purpose, view type, embodiment/version, and reference numerals.
- Separate figures or editable vector source when available.
- Component map and open issues.
- Checklist of requirements to verify for the intended filing route.
- Handoff note that distinguishes concept-level information from verified details.

Never invent an application number, inventor identity, attorney identity, priority date, official seal, or filing status.

## Completion gate

Do not mark the draft complete if reference numerals conflict, a labeled part is missing, cutaway and assembly views contradict, dimensions disagree, a relevant feature lacks description support, jurisdiction-specific rules remain unchecked for an actual filing, or generative artifacts are unresolved.

## Routing

Use `invention-visual-package` for the broader image package and `invention-engineering-handoff` for requirements, BOM, and verification plans. For novelty or claim-scope decisions, route to qualified patent counsel and the existing invention-validation skills as appropriate.
