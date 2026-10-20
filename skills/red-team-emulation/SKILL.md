---
name: red-team-emulation
description: Plan and assess authorized adversary-emulation exercises that validate security controls and detection/response using ATT&CK, Atomic Red Team, CALDERA and Metasploit. Requires bounded authorization.
---

# Authorized Red-Team Emulation

## Purpose

Simulate selected adversary behaviors to answer a defensive question: can an organization prevent, detect, investigate and respond to a defined technique under the stated conditions? This skill does not grant permission to attack systems.

## Reference map

- [MITRE ATT&CK STIX data](https://github.com/mitre-attack/attack-stix-data): map observed behavior to tactics, techniques and platforms. Check current version and applicability.
- [Atomic Red Team](https://github.com/redcanaryco/atomic-red-team): focused tests for validating telemetry and controls. Inspect prerequisites, commands, cleanup and side effects first.
- [MITRE CALDERA](https://github.com/mitre/caldera): controlled adversary emulation. Review plugins, agent privileges, network paths and cleanup behavior before deployment.
- [Metasploit Framework](https://github.com/rapid7/metasploit-framework): reference and controlled validation tool when the exact test is authorized. Confirm scope, version, module behavior and impact first.
- [OWASP ASVS](https://github.com/OWASP/ASVS) and [OWASP Cheat Sheet Series](https://github.com/OWASP/CheatSheetSeries): connect attack paths with defensive requirements.
- [Sigma](https://github.com/SigmaHQ/sigma) and [YARA Rules](https://github.com/Yara-Rules/rules): detection logic and validation references.

## Required authorization gate

Confirm documented rules of engagement: owner, in-scope systems, allowed techniques, testing window, volume ceilings, acceptable impact, cleanup plan, data handling, escalation contact and stop condition. If any is unclear, do not execute a disruptive test; continue with planning, tabletop analysis, synthetic logs or an isolated lab.

Do not introduce persistence, steal credentials, exfiltrate real data, disrupt availability, exceed scope or target a third party without explicit authorization. “Red hat” is ambiguous and can refer to vigilante retaliation; do not equate it with professional red teaming.

## Workflow

1. Define a defensive hypothesis and measurable success criterion.
2. Map it to ATT&CK technique IDs, affected hosts, source telemetry, prevention controls, detection rules and response actions.
3. Choose the smallest test that answers the question. Read the test definition, scripts, privileges, prerequisites, cleanup and side effects before execution.
4. Confirm the environment is an approved lab or in-scope target. Prefer disposable hosts, snapshots, synthetic data and clean rollback.
5. Execute only the approved test and record time, host, versions, configuration, procedure, expected telemetry, observed telemetry and side effects.
6. Validate detection end-to-end: event generation, collection, normalization, rule match, alert, triage and escalation. A successful test script does not prove detection succeeded.
7. Clean up using the reviewed procedure and confirm unrelated data remains intact.
8. Map gaps to remediation owners and concrete re-test criteria.
9. Retest within the same authorized scope and retain only evidence needed for reproducibility.

## Deliverables

Include scope/authorization, ATT&CK mapping, hypothesis, prerequisites, tools/versions, safe execution and cleanup, expected versus observed prevention/telemetry/alerts, limits, remediation owners and repeatable validation. If no test was executed, label the output a plan or tabletop walkthrough, not an assessment result.
