---
name: evidence-driven-reverse-engineering
description: Investigate authorized application behavior, packages, binaries, and runtime interactions through documented REA workflows with explicit evidence, inference, and unknowns.
---

# Evidence-Driven Reverse Engineering

Use this skill when ordinary source inspection is unavailable or insufficient and the task concerns undocumented behavior, packages, binaries, runtime interactions, file formats, or protocols. Preferred reference: https://github.com/morluto/rea.

REA currently describes a CLI/MCP-oriented toolkit with guides for JavaScript/Electron, native binaries, managed/mobile targets, firmware, and other analysis cases. Inspect its current README, installation guide, MCP/tool contract, and target-specific workflow before acting. Do not apply a generic reverse-engineering recipe when the project has a documented path for the target.

## Scope and authorization

- Establish the target, ownership/authorization, question to answer, environment, constraints, and acceptable risk.
- Preserve original artifacts; record a cryptographic hash and version/build identifier when integrity or reproducibility matters.
- Prefer source code, official docs, logs, exported data, and ordinary app behavior first. Go deeper only when those do not answer the question.
- Do not inspect third-party systems beyond authorized scope, disable protections, evade access controls, or run unknown samples on a sensitive host.
- Ask before installing optional native-analysis software or changing agent configuration.

## Target triage and investigation

Classify the target as a web app/JavaScript bundle, Electron/desktop package, mobile/managed package, native executable/library, firmware, process/memory artifact, file format, or protocol. Then:

1. Record the baseline: target identity/hash where relevant, version/build, OS/runtime, permissions, inputs, and reproducible behavior.
2. Enumerate the relevant observable behavior: UI state, inputs/outputs, logs, network/filesystem effects, process behavior, and errors.
3. Choose the least-invasive suitable method. Prefer metadata/static analysis before runtime tracing, instrumentation, debugging, or disassembly unless evidence justifies otherwise.
4. Maintain a hypothesis ledger: question, hypothesis, evidence, alternatives, confidence, and the observation that would distinguish alternatives.
5. Change one meaningful input at a time. Preserve inputs, options, environment assumptions, and output needed to reproduce the result.
6. Reconcile static and runtime evidence. Treat decompiler output as an approximation, not exact source, unless verified.
7. Compare the reconstruction or reimplementation against observed behavior, including negative cases and edge conditions.
8. Stop when the evidence is insufficient; describe what additional observation would resolve the uncertainty.

## Evidence labels

- **Observed:** Directly visible in source, logs, tool output, or a repeatable experiment. Record the file path, tool/command, build, or artifact.
- **Inferred:** An explanation supported by observations but not uniquely established. State confidence and plausible alternatives.
- **Unknown:** Not established by current evidence. Identify the missing observation or test.

Never present guesses or generated pseudocode as verified facts. A plausible explanation is not behavioral parity until it survives a controlled check.

## Deliverable

Write a concise evidence-backed report with scope, target fingerprint, methods/tool versions, observations, inferences with confidence, unresolved questions, and next tests. For reimplementation, add a behavior contract and regression cases that demonstrate parity.

Use the least invasive authorized method and clearly state the limits of the evidence.
