# Skills Index

This repository intentionally uses a directory named **`skills.md/`** to preserve the requested project path while keeping each reusable skill as a complete, installable package rather than flattening its supporting scripts and templates into one Markdown file.

| Collection | Purpose | Entry point |
|---|---|---|
| [`eureka_skill`](./eureka_skill/) | Advanced mathematics, innovation research, high-integrity computation, design-space exploration, formal-claim auditing, and evidence-driven task completion. | [`COLLECTION.md`](./eureka_skill/COLLECTION.md), [`eureka-skill/SKILL.md`](./eureka_skill/skills/eureka-skill/SKILL.md), and [`unlazy-workflow/SKILL.md`](./eureka_skill/skills/unlazy-workflow/SKILL.md) |
| [Unlazy engineering workflow](../skills/unlazy-orchestrator/) | General-purpose reusable workflow skills for acceptance gates, safe check inspection, depth-tree planning, independent verification, and evidence-backed reporting. | [`SKILL.md`](../skills/unlazy-orchestrator/SKILL.md) and [`README.md`](../skills/unlazy-orchestrator/README.md) |
| [Full-stack application delivery set](../skills/full-stack-engineering-suite.md) | Routed implementation and verification skills for frontend UX, FastAPI accounts, relational data, Docker/cloud, CI, and production readiness. | [`Full-stack skill index`](../skills/full-stack-engineering-suite.md) |
| [Reference-driven engineering skill set](../skills/skill-sets/README.md) | Source-inspected patterns for frontend UX, multi-application architecture, evidence-driven reverse engineering, and tool selection. | [Skill-set README](../skills/skill-sets/README.md) |
| [Technical Reference Skill Set](../skills/technical-reference-skill-set.md) | Routed repository and specialist workflows for backend/cloud, reverse engineering, authorized security assessment, red-team emulation, and threat detection. | [Technical Reference Router](../skills/technical-reference-router/SKILL.md) |

The collection documentation explains scope and release validation. Each directory beneath `eureka_skill/skills/` is a standalone skill package with its own `SKILL.md`. The Unlazy-inspired packages add task contracts, acceptance gates, dependency-aware orchestration, and completion audits; they adapt workflow principles and do not claim that the upstream Unlazy CLI or hooks are installed.

## General engineering workflow skills

This standalone package under `skills/` complements the repository-specific Unlazy-oriented skills in `skills.md/eureka_skill/skills/`. Use it for reusable engineering and repository work:

- [`unlazy-orchestrator`](../skills/unlazy-orchestrator/SKILL.md) — entry point and mode selection.
- [`unlazy-depth-tree`](../skills/unlazy-depth-tree/SKILL.md) — decomposition, ownership, dependencies, and integration.
- [`unlazy-acceptance-gates`](../skills/unlazy-acceptance-gates/SKILL.md) — observable success criteria and safe command inspection.
- [`unlazy-verification`](../skills/unlazy-verification/SKILL.md) — four-pass delivery and independent re-verification.
- [`unlazy-final-audit`](../skills/unlazy-final-audit/SKILL.md) — requirement reconciliation and evidence-based reporting.

The package includes Markdown templates, not the upstream executable checker or hook tooling.


## Full-stack application delivery

For connected product-engineering tasks, use the [Full-stack Engineering Skill Set](../skills/full-stack-engineering-suite.md). It complements the evidence-first eureka collection and existing Unlazy workflow skills with specialist procedures for frontend UX, FastAPI authentication, database migrations, Docker/cloud deployment, CI verification, and production-readiness audits.


## Reference-driven engineering

Use the [Reference-Driven Engineering Skill Set](../skills/skill-sets/README.md) for frontend/UI/UX, multi-application architecture, repository verification, or reverse engineering tasks that benefit from the four preferred upstream repositories. It contains a routing skill plus focused specialists for ArtCraft-inspired UX, Everything-style app boundaries, REA investigation workflows, and reverse-engineering tool selection. Re-inspect the actual source and documentation as needed; these references are not a mandate to copy their implementations.
