---
name: reverse-engineering-tool-selection
description: Select suitable reverse-engineering, debugging, binary-analysis, instrumentation, and application-inspection tools using task requirements and the Awesome Reverse Engineering catalog.
---

# Reverse-Engineering Tool Selection

Use https://github.com/morluto/awesome-reverse-engineering as a curated starting point when choosing tools for software behavior, binaries, protocols, firmware, managed/mobile apps, or runtime inspection. Re-read the current catalog because categories and project health change.

The current catalog organizes resources by task, including file identification/triage, native analysis, debuggers, dynamic instrumentation/tracing, malware analysis, Android and managed code, Apple platforms, runtimes/packagers, web/protocols, firmware/file formats, diffing frameworks, and AI-assisted analysis.

## Selection workflow

1. Define the question and target type before naming tools: file triage, symbol recovery, build diffing, runtime-call observation, package inspection, or protocol reproduction.
2. Start at the matching catalog section, then inspect the candidate tool's official project page and documentation.
3. Compare target OS/architecture, file/runtime format, static versus dynamic needs, installation footprint, required privileges, reproducibility, automation/export support, licensing, maintenance, cost, and data handling.
4. Prefer the least-invasive tool that resolves the question. Start with metadata or source inspection; add instrumentation/debugging only when necessary and authorized.
5. Recommend one primary tool and, where useful, one independent corroborating tool. Avoid a long list without a decision.
6. Validate the fit with a harmless sample, a minimal read-only probe, or an isolated environment before analyzing a consequential target.
7. Record tool version, configuration, assumptions, relevant output, and known limitations.

## Evaluation matrix

| Dimension | Questions |
|---|---|
| Compatibility | Does it support this OS, architecture, format, and runtime version? |
| Fit | Does it answer the question, or only expose more data? |
| Evidence | Can outputs be saved, reproduced, exported, and independently checked? |
| Safety | Does it need elevated privileges, invasive hooks, or execution of unknown code? |
| Automation | Is CLI, API, scripting, or MCP support available and documented? |
| Maintenance | Are releases, supported versions, issue activity, and install steps credible? |
| License/cost | Is use permitted for this context and budget? |
| Privacy | Does analysis stay local or upload artifacts to an external service? |

## Recommendation format

Provide a short ranked decision: recommended tool and task fit; evidence and official documentation supporting compatibility; one viable alternative; installation/permission/privacy/license risks; least-invasive initial test; and conditions that would change the recommendation.

Do not treat popularity or a catalog listing as proof of safety, compatibility, quality, or current maintenance. Re-verify current version, license, supported targets, and install steps before giving actionable commands. Do not install software, grant elevated privileges, execute suspicious files, or instrument a third-party process without appropriate authorization. If no option clearly fits, say so and identify the missing requirement or test.
