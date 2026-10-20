# Unlazy-inspired Workflow Skill Set

A reusable set of five agent skills for substantial development and delivery work, adapted for this repository's skills/ convention.

## Entry point

Start with SKILL.md. It routes the task to the supporting skills:

- unlazy-depth-tree/SKILL.md — contracts, decomposition, ownership, dependencies, and integration.
- unlazy-acceptance-gates/SKILL.md — observable gates and safe command inspection.
- unlazy-verification/SKILL.md — implementation, review, defect hunt, polish, and re-verification.
- unlazy-final-audit/SKILL.md — requirement reconciliation and evidence-backed reports.

Templates are in templates/. They are lightweight Markdown aids, not a substitute for executable validation tooling.

## Use and limitations

These skills adapt the methodology rather than vendoring Unlazy's scripts or hooks. They do not automatically execute commands, enforce approval gates, lock files, record cryptographic evidence, or block an agent from stopping. If executable enforcement is later added, it must be independently reviewed and tested.

Use formal gates for substantial work; do not burden trivial tasks with unnecessary ceremony. Select the smallest depth tree that exposes all independent deliverables and integration points. Never claim a gate, test, deployment, or PR status without current evidence.

## Source and license

Inspired by Leonxlnx/unlazy (https://github.com/Leonxlnx/unlazy), especially its SKILL.md, Depth Tree method, gate contract, four-pass workflow, verification hierarchy, and final claim audit. Original source is MIT-licensed. The following license notice is retained to comply with attribution requirements for adapted material.

MIT License

Copyright (c) 2026 Leonxlnx

Permission is hereby granted, free of charge, to any person obtaining a copy
of this software and associated documentation files (the "Software"), to deal
in the Software without restriction, including without limitation the rights
to use, copy, modify, merge, publish, distribute, sublicense, and/or sell
copies of the Software, and to permit persons to whom the Software is
furnished to do so, subject to the following conditions:

The above copyright notice and this permission notice shall be included in
all copies or substantial portions of the Software.

THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS OR
IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF MERCHANTABILITY,
FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN NO EVENT SHALL THE
AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER
LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING FROM,
OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE USE OR OTHER DEALINGS IN
THE SOFTWARE.
