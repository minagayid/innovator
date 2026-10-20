---
name: production-readiness-audit
description: Perform an evidence-based predeployment audit of application behavior, authentication, privacy, database safety, cloud configuration, observability, operations, and launch blockers. Use when asked whether an app is deployment-ready or production-ready.
---

# Production Readiness Audit

## Readiness is evidence, not a file checklist

Inspect the request, live code, deployment target, CI results, required services, and operator responsibilities. Separate implemented behavior from configured behavior, tested behavior, real deployment, and operational readiness. Do not infer production readiness from a Dockerfile or green unit tests.

## Audit domains

### Product and application
- Required routes and API contracts work end-to-end, including not-found and error behavior.
- Forms validate clearly, accessibility and narrow-screen behavior are checked, and secrets or internal exceptions are not exposed.
- User data is scoped to the authenticated owner. Pagination, request limits, timeouts, and concurrency boundaries are suitable for expected load.

### Identity and abuse resistance
- Signup/login and logout/session revocation behave correctly.
- Email verification, account recovery/password reset, account disablement/deletion, and support ownership have an explicit implemented or approved deferred status.
- Token rotation/revocation, password hashing, OAuth state/redirect validation, cookie security, CORS/CSRF posture, rate limiting, and key rotation are reviewed.
- Multi-replica abuse protection uses a shared store or gateway control rather than uncoordinated in-process state alone.
- Personal data and credentials are excluded from logs and error payloads.

### Data
- A clean database initialization and an upgrade from the previous schema both pass.
- Constraints, indexes, connection pool, transaction handling, backup schedule, restore procedure, deletion policy, and retention are explicit.
- Migration execution is serialized and rollback/forward-repair steps are documented.
- The cloud storage model is durable under container replacement and horizontal scaling.

### Runtime and cloud
- Configuration is typed, validated and environment-specific; insecure production defaults fail closed.
- Secrets are supplied via the provider's secret mechanism, not committed or baked into images.
- Image runs non-root where feasible, serves the right port, exposes meaningful liveness/readiness probes, and shuts down cleanly.
- TLS, proxy trust, CORS origins, domains, OAuth callback URLs, resource limits, logging, metrics, alerts, and deployment permissions are configured for the chosen provider.
- CI verifies the current source revision; rollback steps and a smoke-test plan exist.

### Privacy and operations
- Data inventory, purpose, retention, deletion/export expectations, audit access, and incident ownership are documented at the level required by the product and applicable law.
- Observability supports diagnosis without collecting unnecessary sensitive data.
- The team can detect an unhealthy service, restore data, revoke compromised credentials, and roll back a faulty release.

## Findings format

For each finding record: ID, severity (blocker/high/medium/low), evidence or missing evidence, user impact, the smallest safe remediation, owner, and whether it blocks launch. Avoid declaring a control present based only on configuration names; inspect the implementation and execute the relevant check where authorized.

Summarize with one of these explicit statuses:
- NOT READY: at least one unaccepted launch blocker exists.
- READY WITH CONDITIONS: no known blocker remains, but named low/medium risks or operator setup conditions require acceptance.
- READY: required gates have current evidence and no unresolved launch blocker remains within the defined scope.

These are scoped conclusions, not certifications. State deployment target, commit inspected, gates run, unverified controls, and external operator dependencies.

## Stop conditions

Do not run destructive migrations, delete data, change production secrets, alter DNS, deploy or roll back production, or perform irreversible account changes as part of a read-only audit. Obtain the required authorization through the appropriate workflow. Do not mark email verification, password reset, external OAuth, backups, or monitoring complete until each is actually implemented/configured and evidenced.
