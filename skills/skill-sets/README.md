# Reference-Driven Engineering Skill Set

A reusable skill set distilled from four preferred upstream reference repositories. It routes engineering tasks to the right specialist, emphasizes source inspection before adopting patterns, and requires evidence-based verification.

## Included skills

| Skill | Use it for | Reference |
|---|---|---|
| [Reference-driven engineering](../reference-driven-engineering/SKILL.md) | Entry point, repository-first planning, routing, and evidence-backed completion | All four references |
| [ArtCraft-inspired frontend UX](../artcraft-frontend-ux/SKILL.md) | Creative/editor interfaces, React/TypeScript UI patterns, canvas workflows, accessibility, and responsive behavior | [storytold/artcraft](https://github.com/storytold/artcraft) |
| [Multi-application architecture](../multi-application-architecture/SKILL.md) | App shells, discovery, navigation contracts, shared packages, and boundaries | [HeyPuter/everything](https://github.com/HeyPuter/everything) |
| [Evidence-driven reverse engineering](../evidence-driven-reverse-engineering/SKILL.md) | Authorized behavior investigation, static/runtime evidence, binary and package analysis | [morluto/rea](https://github.com/morluto/rea) |
| [Reverse-engineering tool selection](../reverse-engineering-tool-selection/SKILL.md) | Choosing an appropriate debugger, disassembler, tracing, or inspection utility | [morluto/awesome-reverse-engineering](https://github.com/morluto/awesome-reverse-engineering) |

## Expanded technical reference coverage

The [Technical Reference Skill Set](../technical-reference-skill-set.md) adds a broad router and specialist procedures for backend/cloud reference selection, authorized reverse engineering, OWASP-based security assessment, authorized red-team emulation, and defensive threat research/detection engineering. It preserves this set's ArtCraft, Everything, and REA/awesome-reverse-engineering guidance and links to the existing full-stack implementation skills rather than duplicating them.

## Shared method

1. Inspect the target repository's current state, instructions, architecture, manifests, scripts, and tests.
2. Read only the upstream source and workflow documentation relevant to the task, and verify it is current.
3. Separate transferable principles from implementation details specific to the reference.
4. Compare alternatives when trade-offs matter and explain why the selected pattern fits the target stack.
5. Implement small, maintainable changes and verify behavior with tests, builds, accessibility/responsive checks, or controlled experiments as appropriate.
6. Report what was inspected and executed. Distinguish observed facts, inferences, assumptions, and unknowns.

## Source repositories

- [Storytold / ArtCraft](https://github.com/storytold/artcraft) — creative-tool UX and modular frontend references.
- [HeyPuter / Everything](https://github.com/HeyPuter/everything) — multi-application product and monorepository references.
- [Morluto / REA](https://github.com/morluto/rea) — documented behavior investigation and reverse-engineering workflows.
- [Morluto / Awesome Reverse Engineering](https://github.com/morluto/awesome-reverse-engineering) — curated tooling catalog.

These projects are living upstreams, not required runtime dependencies. Do not import implementations wholesale. Adapt relevant ideas to the target repository and never claim an upstream behavior, test, or build was verified without inspecting or executing it.
