---
name: reference-driven-engineering
description: Route frontend, architecture, testing, and reverse-engineering work through inspected reference repositories and evidence-backed implementation workflows.
---

# Reference-Driven Engineering

Use this as the entry point when work spans frontend/UI/UX, multi-application architecture, repository testing, or reverse engineering. It routes to focused skills without treating any upstream project as a template to copy.

## Preferred reference map

- **ArtCraft:** https://github.com/storytold/artcraft — creative-tool UX, editor workflows, and modular frontend patterns. Its current repository guidance describes Rust and TypeScript, an Nx frontend workspace, React/Vite, shared libraries, and interactive 2D/3D capabilities. Re-check the current branch and package before relying on these details.
- **Everything:** https://github.com/HeyPuter/everything — a multi-application monorepository with individual applications under src/. Inspect the specific app and shared infrastructure before transferring a pattern.
- **REA:** https://github.com/morluto/rea — documented CLI/MCP workflows for investigating application behavior, JavaScript/Electron packages, native binaries, managed code, and other targets. Follow the current guide for the actual target type.
- **Awesome Reverse Engineering:** https://github.com/morluto/awesome-reverse-engineering — a categorized directory for binary triage, native analysis, debuggers, instrumentation, managed/mobile targets, web/protocols, firmware, file formats, diffing, and AI-assisted analysis.

## Specialist routing

- Creative editors, interactive canvases, polished layouts, responsive behavior, and accessibility: [artcraft-frontend-ux](../artcraft-frontend-ux/SKILL.md).
- App shells, discovery, navigation, shared capabilities, standalone app boundaries, and monorepository design: [multi-application-architecture](../multi-application-architecture/SKILL.md).
- Undocumented behavior, packages, binaries, runtime interactions, and evidence-based reconstruction: [evidence-driven-reverse-engineering](../evidence-driven-reverse-engineering/SKILL.md).
- Selecting debuggers, disassemblers, instrumentation, and inspection tools: [reverse-engineering-tool-selection](../reverse-engineering-tool-selection/SKILL.md).

For normal code review, inspect source code directly; do not invoke reverse-engineering methods without a clear need.

## Default workflow

1. Resolve the exact target repository, branch, scope, acceptance criteria, and authorization for edits or external actions.
2. Inspect repository instructions, working-tree status, architecture, manifests, scripts, tests, and the implementation near the requested change.
3. Read relevant upstream documentation and source files. Verify current paths and versions; do not rely on remembered snapshots alone.
4. Compare approaches when trade-offs matter. Explain which upstream pattern transfers, which does not, and why the target stack favors the selected approach.
5. Make small, maintainable changes. Prefer clear module boundaries, accessible reusable components where reuse is real, and minimal duplication.
6. Run relevant tests, lint checks, builds, accessibility/responsive checks, regression tests, or controlled experiments as appropriate.
7. Report changed paths and checks actually performed. Separate observed facts from inferences, assumptions, and unknowns.

## Guardrails

Adapt references to the target project's stack and requirements. Do not add dependencies or copy code merely because an upstream project uses them. Preserve unrelated work and credentials; avoid destructive actions or external mutations without authorization. For reverse engineering, confirm authorization and select the least-invasive method that answers the question. Never claim an inspection, test, build, or runtime behavior was verified unless it was.
