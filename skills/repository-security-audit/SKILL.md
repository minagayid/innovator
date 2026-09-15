---
name: repository-security-audit
description: Audit one or more code repositories for security and release readiness with evidence-backed static review and safe local tests; use for defensive repository reviews, not live-system attacks.
metadata:
  hermes:
    tags: [security, software-development, repository-audit]
---

# Repository Security Audit

Use this when the user asks for a security, reliability, or release-readiness review of one or more repositories.

## Set the audit boundary

- Name the repositories and revisions in scope. If the user says “all repositories,” enumerate the accessible set and distinguish those reviewed from private, unavailable, non-GitHub, or unconnected repositories.
- Record the purpose, non-goals, allowed side effects, acceptance checks, and a small time/tool budget before a broad review.
- Inspect repository instructions, remotes, current branch, and dirty status before running tests or changing files. Treat uncommitted edits and untracked assets as user work until their purpose is clear.
- Do not read .env files, credentials, private datasets, or generated sensitive outputs. Do not install packages, probe live deployments, or make external changes as part of a code-only audit.

## Review with separate lenses

For each repository, trace the important assets, trust boundaries, inputs, persistence, identity, permissions, external calls, and resource costs.

- **White-hat lens:** check intended controls, safe defaults, recovery behavior, observability, and whether tests demonstrate the claimed boundary.
- **Red-hat lens:** try to form realistic abuse paths from untrusted inputs, weak identity, parsing, concurrency, and limits. Use static reasoning or synthetic local tests only.
- **Black-hat lens:** assume controls can be bypassed, error paths are ambiguous, and components interact in unexpected ways. Challenge the implementation with bounded local cases; do not attack live systems or access data outside the authorized repository.
- If the user asks for independent reviewers and suitable agents are available, delegate small read-only review slices and reconcile their evidence. Otherwise use the lenses yourself and do not claim independent review or professional credentials.

## Report evidence, not suspicion

For every actionable finding, record severity, affected path and line, the trigger or attack path, practical impact, confidence, and a concrete repair. Mark a finding as confirmed only when the code or a safe reproduction supports it. Keep code defects separate from deployment, product, legal, clinical, or governance decisions.

Use focused tests already available in the repository. Prefer synthetic fixtures and mocks that do not contact external services. If the documented test path would read secrets, use private data, install dependencies, or access a live service, stop that test and explain the limitation. Do not describe a project as “solid,” “safe,” or production-ready while material findings or release gates remain.

## Deliverable

Give a per-repository result, shared cross-repository patterns, checks actually run with observed outcomes, skipped or unsupported checks, and remaining release gates. State whether the audit covered local checkouts, named GitHub repositories, or a verified complete account inventory.