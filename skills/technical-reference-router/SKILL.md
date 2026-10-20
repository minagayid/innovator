---
name: technical-reference-router
description: Route engineering and research tasks to saved technical-reference repositories and specialized skills across frontend/product architecture, FastAPI/backend, authentication, databases, deployment, reverse engineering, and cybersecurity. Use at the start of cross-cutting technical work or when selecting tools.
---

# Technical Reference Router

## Objective

Choose the smallest relevant set of references and existing skills for the current task. This profile is a reference library, not a list of mandatory dependencies. Preserve existing architecture and preferences unless evidence or requirements justify a change.

## Start here

1. Read the current request and amendments. Identify the outcome, target repository, runtime/platform constraints, data sensitivity, authorized scope, deliverables, and prohibited changes.
2. Inspect the actual target repository: instructions, README, directory structure, manifests and lockfiles, entry points, API/data/auth boundaries, tests, CI, deployment files, license, and branch/worktree state when available.
3. Check current official docs, releases/activity, supported versions, security advisories, license, compatibility, and operational requirements. Do not say a repository was inspected if only its URL or a search result was seen.
4. Select only the specialists needed. For cross-layer changes, agree shared contracts before implementation and use existing full-stack orchestration.

## Route by task

- Creative tools, React/TypeScript, editor layouts, canvas interactions, accessibility and responsive UX: use the existing ArtCraft-inspired frontend skill and inspect [ArtCraft](https://github.com/storytold/artcraft).
- Multi-app navigation, shells, onboarding, package boundaries and monorepo architecture: use the existing multi-application architecture skill and inspect [Everything](https://github.com/HeyPuter/everything).
- Connected frontend/backend/data/deployment work: use [Full-stack Product Delivery](../fullstack-product-delivery/SKILL.md) and the [Full-stack Engineering Skill Set](../full-stack-engineering-suite.md).
- FastAPI endpoints, signup/login, account recovery, profiles, permissions, persistence, Docker or cloud: use [Backend and Cloud Reference Guide](../backend-cloud-reference-guide/SKILL.md) and the existing FastAPI auth, data migration, Docker/cloud, CI, and production-readiness skills as relevant.
- Application behavior, desktop/mobile packages, compiled artifacts, disassembly, decompilation, obfuscated strings or memory captures: use [Reverse Engineering Investigation](../reverse-engineering-investigation/SKILL.md), with REA and Ghidra as complementary approaches.
- Authorized web application testing and secure-code review: use [Authorized Security Assessment](../authorized-security-assessment/SKILL.md).
- Authorized adversary simulation or validation of defensive controls: use [Red-Team Emulation](../red-team-emulation/SKILL.md).
- Malware triage, detection rules, threat hunting, or incident response: use [Threat Research and Detection Engineering](../threat-research-detection/SKILL.md).
- Release go/no-go decisions: add the existing production-readiness and repo-deployment-hardening skills. Separate static/configuration review from actual deployment.

## Reference-selection rules

- REA is an evidence-driven investigation workflow; Ghidra is a binary-analysis suite. They overlap but are not interchangeable.
- Use Awesome Reverse Engineering and Awesome Pentest as discovery indexes. Evaluate each candidate tool independently.
- Prefer Juice Shop, WebGoat and DVWA for controlled practical web-security learning.
- Use Metasploit, CALDERA and Atomic Red Team only within documented, authorized scope and controlled environments.
- Use Sigma, YARA, ATT&CK data, CAPEv2, FLARE-FLOSS and Volatility for threat understanding, analysis, and defensive validation rather than unauthorized compromise.
- For identity, compare managed auth, self-hosted identity and app-managed auth against product requirements. Do not choose an architecture only because a template uses it.
- Do not copy upstream code wholesale. Check license, dependencies, maintenance, security implications, compatibility and project fit.

## Evidence and implementation standards

Classify material statements as observed, tested, inferred, hypothesis, or unknown. For implementation, define acceptance checks, make small reviewable changes, test negative/security cases, run relevant regression checks, inspect the final diff, and state limitations. Preserve unrelated work. Use reviewable branches/PRs; do not merge, deploy, or make destructive/external changes without authorization.

## Safety boundary

When the user says “hacking,” interpret this as broad interest across offensive security, defense, reverse engineering and research—not blanket authorization against third parties. Explain mechanisms with impact, detection, mitigation and safe validation. Keep disruptive experiments to owned or explicitly authorized systems, ideally isolated labs.

## Completion checklist

- [ ] Target repository and environment inspected to the degree claimed.
- [ ] References match stack, scope, licensing and maintenance constraints.
- [ ] Relevant acceptance checks include negative/security cases.
- [ ] Results are reproducible or limitations are explicit.
- [ ] Inspections, tests, commits and deployments are reported only if they happened.
- [ ] Existing preferences and repository context are preserved.
