---
name: invention-visual-package
description: Create a coordinated visual package for a proposed physical invention, including a hero render, internal cross-section, orthographic blueprint, exploded assembly, functional flow, application views, and a delivery archive. Use when a user asks to visualize, explain, pitch, or prepare concept images for an invention.
---

# Invention Visual Package

Create a coherent set of invention visuals that communicates one defined concept across product, internal, engineering, and workflow views. Optimize for consistency and traceability—not for making a speculative product look proven.

## Operating rules

- If the user asks you to choose the invention, select a useful, bounded concept and proceed without an unnecessary interview.
- Treat missing details as explicit assumptions when safe. Ask only when a missing fact materially changes the result or creates a safety issue.
- Establish one canonical design description before making images. Reuse the name, silhouette, orientation, component IDs, relationships, dimensions, and operating sequence across all views.
- Prefer separate images per deliverable. A dense overview board can supplement, but should not replace, readable individual figures.
- Use the available image-generation tool for requested concept imagery. For exact labels, dimensions, and repeatable identifiers, prefer editable vector/diagram sources or overlay labels after generation when tools permit; image models can misspell labels and alter parts.
- Never infer performance, regulatory compliance, medical efficacy, novelty, or patentability from a render.
- Keep user-provided facts distinct from sourced facts, calculations, proposals, and unresolved details.

## Workflow

1. **Define the brief.** Capture the problem, intended user/environment, operating principle, inputs and outputs, constraints, and purpose (ideation, pitch, engineering handoff, or patent-professional discussion).
2. **Lock the concept.** Record outer form; major assemblies; a stable component register; part interfaces; any authoritative dimensions/units; and unknowns.
3. **Plan the view set.** Normally include: (a) hero/exterior view; (b) internal cross-section/cutaway; (c) orthographic technical views such as front/side/top; (d) exploded assembly; (e) functional flow; (f) use-case/application view; and (g) a patent-style line-art sheet when useful.
4. **Create each view against the same design lock.** Repeat the core geometry and component relationships in each prompt, describing only details visible in that view. Avoid adding a feature in one view that contradicts another.
5. **Keep a component map.** Track part ID → exact name → function → interfaces → views in which it appears. Reuse labels and numbering verbatim.
6. **Inspect and correct.** Review for geometry drift, missing/duplicated parts, impossible assembly order, wrong arrow directions, text errors, unsupported numeric claims, and misleading safety/performance language. Correct or flag defects.
7. **Package the handoff.** Save descriptive filenames, the brief, view register, asset manifest, and README explaining what is supplied, proposed, or unverified. Create a ZIP only after checking that its listed files exist.
8. **Report truthfully.** Link only artifacts created and verified in the current task. Describe the package as conceptual unless engineering details have been independently verified.

## View quality gates

- **Cross-section:** inner layout is legible; callout leaders point to the right parts; relevant power, fluid, thermal, signal, or motion paths are distinguished.
- **Blueprint:** views describe the same outer envelope; dimensions use units and a datum; unknown dimensions are marked conceptual or omitted.
- **Exploded assembly:** components are separated along plausible assembly axes; key connectors, seals, wiring, fasteners, and service access are shown where relevant; BOM and figure agree.
- **Functional flow:** arrows express direction and causality; each stage has clear inputs/outputs; feedback, power, interlocks, and failure paths appear when material.
- **Applications:** contexts demonstrate intended uses without implying measured outcomes or field validation.
- **Typography:** keep labels short and readable; manually check labels, numbering, screens, gauges, ports, connectors, seals, and small text.

## Suggested output structure

```text
invention-visual-package/
├── README.md
├── invention-brief.md
├── asset-manifest.json
├── 01-concept-overview.png
├── 02-cross-section.png
├── 03-technical-blueprint.png
├── 04-exploded-assembly.png
├── 05-functional-flow.png
├── 06-use-cases.png
└── 07-patent-style-figures.png
```

Adapt to the task; do not create empty placeholder assets for views that were not generated.

## Routing

- Use this skill for a one-off coordinated visual set.
- For significant quantitative feasibility, materials, energy, biological mechanisms, or safety questions, route to `bounded-invention-engineering` and reflect its findings without overclaiming.
- For patent-oriented figures, also use `patent-figure-preparation` and recommend jurisdiction-specific review by qualified patent counsel.
- For manufacturing, procurement, or test planning, use `invention-engineering-handoff`.

## Completion checklist

- [ ] One canonical design description exists.
- [ ] Part names and IDs agree across every applicable view.
- [ ] Dimensions are sourced, explicitly assumed, or omitted.
- [ ] Every delivered image was inspected for obvious contradictions and text defects.
- [ ] Asset links and archive contents were verified.
- [ ] Limitations and next engineering steps are stated.
