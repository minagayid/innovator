---
name: authorized-security-assessment
description: Plan or conduct authorized web-application security assessments, secure-code reviews, and safe vulnerability reproduction using OWASP references and deliberately vulnerable labs.
---

# Authorized Security Assessment

## Objective

Find and explain weaknesses within a clearly authorized scope, then produce testable remediation guidance. Pair offensive verification with defensive controls and regression checks. Possessing a tool does not establish authorization.

## Reference map

- [OWASP Juice Shop](https://github.com/juice-shop/juice-shop), [WebGoat](https://github.com/WebGoat/WebGoat), and [DVWA](https://github.com/digininja/DVWA): deliberately vulnerable training targets for repeatable local/isolated exercises.
- [OWASP ZAP](https://github.com/zaproxy/zaproxy): authorized proxy-based inspection and testing. Review scan scope and generated traffic before sending it.
- [OWASP ASVS](https://github.com/OWASP/ASVS): structured security controls and verification acceptance criteria.
- [OWASP Cheat Sheet Series](https://github.com/OWASP/CheatSheetSeries): implementation/remediation guidance for authentication, sessions, access control, input handling, headers, file uploads and related concerns.
- [Awesome Pentest](https://github.com/enaqx/awesome-pentest): discovery index only; vet each candidate for license, maintenance, privileges, side effects and scope.
- Also inspect the target's actual source, dependency manifests, API contracts, deployment, tests and current framework documentation.

## Scope gate

Before testing, document owner/authorization, exact systems/apps/accounts in scope, test window, permitted test types, rate limits, prohibited actions, stop conditions, escalation contact, test data and retention. Clarify whether active scanning, state-changing tests, authenticated testing, file uploads or production testing are allowed.

If authorization is missing or unclear, stick to code review, threat modeling, local training apps and lab-contained reproductions; do not probe third-party systems.

## Workflow

1. Map entry points, trust boundaries, authn/authz, sensitive data, storage, API routes, dependencies, configuration, deployment and logs.
2. Threat-model assets and abuse cases. Prioritize risks based on the actual application, including access-control bypass, cross-user/tenant data exposure, injection, session flaws, insecure file handling, SSRF, secrets and vulnerable dependencies.
3. Establish a baseline using relevant ASVS controls and OWASP Cheat Sheets. Record exclusions.
4. Review code/config first. For ZAP, define the target context and exclusions; start with passive checks. Run active scans only when specifically authorized.
5. Reproduce with minimal, non-destructive requests or lab targets. Capture redacted request/response or test evidence and document expected versus actual behavior.
6. Describe realistic impact, preconditions, affected users, confidence and limits without exaggeration.
7. Recommend code/config fixes and add regression tests that fail for the vulnerable behavior and pass after remediation.
8. Run relevant tests and static/dependency/container scanners where available. Treat alerts as leads requiring triage.
9. Retest the fix and adjacent negative paths; record unresolved exposure.

## Control checklist

- Authentication: password hashing, verification/recovery, expiry/revocation, generic failure behavior and rate limits as applicable.
- Authorization: enforce ownership and privileged actions on the server; test cross-user and cross-tenant access.
- Browser security: assess CSRF, CORS, cookie flags, redirects, CSP and headers for the client topology.
- Data access: parameterized queries, validation, safe serialization, least-privilege database roles and retention.
- Deployment: debug settings, exposed ports, secrets, TLS, default credentials, container user, service networks, health endpoints and backups.
- Logging: never log passwords, raw tokens, reset tokens, private keys or unnecessary personal data.

## Output contract

Rank findings by severity with evidence, affected component, prerequisites, realistic impact, confidence, remediation and reproducible validation. Label hypotheses and non-findings. State whether the environment was lab, staging or production and exactly which checks were run. Do not claim a scan, penetration test or remediation verification that did not occur.
