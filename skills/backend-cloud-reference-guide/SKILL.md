---
name: backend-cloud-reference-guide
description: Select and apply current references for FastAPI APIs, authentication/signup, identity providers, user-data persistence, Docker, application security, CI/CD and cloud deployment.
---

# Backend and Cloud Reference Guide

## Goal

Choose a design that fits the product, then implement and verify the smallest complete, secure, maintainable solution. This guide complements—not replaces—the existing fastapi-auth-accounts, data-models-and-migrations, docker-cloud-deployment, integration-testing-ci and production-readiness-audit skills.

## Repository map

### Python APIs and relational data
- [FastAPI](https://github.com/fastapi/fastapi): primary reference for routing, dependency injection, validation, OpenAPI, API tests and security/deployment patterns.
- [FastAPI Full Stack Template](https://github.com/fastapi/full-stack-fastapi-template): end-to-end example of React/TypeScript, FastAPI, PostgreSQL/SQLModel, registration/recovery, Docker Compose, HTTPS routing and CI/CD. A reference, not a mandate to adopt its whole stack.
- [Uvicorn](https://github.com/encode/uvicorn): ASGI runtime, server configuration and process behavior.
- [Pydantic Settings](https://github.com/pydantic/pydantic-settings): typed, environment-driven settings.
- [SQLAlchemy](https://github.com/sqlalchemy/sqlalchemy): ORM, SQL expressions, sessions and transactions.
- [Alembic](https://github.com/sqlalchemy/alembic): versioned schema migrations.
- [PostgreSQL](https://github.com/postgres/postgres): relational persistence, constraints, transactions, indexing, access control and operations.
- [Redis](https://github.com/redis/redis): caching, rate limiting, ephemeral state and coordination when an additional datastore is justified.

### Authentication and identity
- [Supabase](https://github.com/supabase/supabase): integrated PostgreSQL/auth/storage/realtime. Review Row Level Security, exposed schemas, service-role keys, policies, backups and self-hosting before use.
- [Keycloak](https://github.com/keycloak/keycloak): self-hosted identity, OAuth 2.0/OIDC, SAML, SSO, brokers and roles/groups.
- [ZITADEL](https://github.com/zitadel/zitadel): identity infrastructure, OIDC/SAML, MFA, passkeys, SSO and machine-to-machine identity.
- [Authlib](https://github.com/authlib/authlib): Python OAuth/OIDC integrations and protocol utilities.
- [FastAPI Users](https://github.com/fastapi-users/fastapi-users): existing account lifecycle/auth patterns. Its documented maintenance-only status must be rechecked; do not automatically choose it for a new system.

### Containers, reverse proxy and infrastructure
- [Docker Compose](https://github.com/docker/compose): repeatable multi-service development/test/staging environments.
- [Traefik](https://github.com/traefik/traefik): reverse proxy, routing, TLS and edge configuration.
- [Coolify](https://github.com/coollabsio/coolify): self-hostable Dockerfile/Compose deployment platform. Evaluate operations, security and backup burdens before self-hosting.
- [Terraform](https://github.com/hashicorp/terraform): versioned infrastructure-as-code when repeatable cloud provisioning and review are useful.

### Security and quality tools
- [Bandit](https://github.com/PyCQA/bandit): Python static security analysis.
- [pip-audit](https://github.com/pypa/pip-audit): Python dependency vulnerability checks.
- [Trivy](https://github.com/aquasecurity/trivy): filesystem, dependency, container, secret and infrastructure-misconfiguration scans.
- Use saved [OWASP ASVS](https://github.com/OWASP/ASVS) and [OWASP Cheat Sheet Series](https://github.com/OWASP/CheatSheetSeries) for requirements and remediation; use [ZAP](https://github.com/zaproxy/zaproxy) only in an authorized scope.

## Architecture choice

Clarify client topology (same-site web, cross-origin SPA, mobile, service-to-service), identity requirements (passwords, social OIDC, organization SSO, MFA/passkeys, invites, teams/tenants, recovery/deletion, service accounts), data ownership/retention, backup objectives, residency/compliance, budget, scale and who operates the platform.

Compare deliberately:
1. Managed identity/backend such as Supabase, when lower operational burden is valuable and data policies can be correctly enforced.
2. Self-hosted identity such as Keycloak or ZITADEL, when protocol/control requirements justify identity infrastructure operations.
3. Application-managed identity, where suitable, using maintained libraries and carefully designed sessions/OAuth flows.

Do not add Redis, a separate identity service, Terraform, Traefik or a hosting control plane without a requirement. Preserve a working project architecture unless evidence and constraints justify changing it.

## Implementation requirements

- Keep production secrets in a secret manager/runtime environment, never source, image layers, build args or frontend bundles. Commit placeholder-only environment examples.
- Use request/response schemas that prevent password hashes, internal fields or tokens from leaking.
- Enforce ownership and tenant authorization server-side for every relevant read/write. Test that user A cannot access user B's objects.
- Use constraints, transactions, migrations, data-retention policy and verified backup/restore. Plan safe schema rollout and rollback/forward repair.
- Implement appropriate password hashing, email verification/recovery, secure cookie attributes, CSRF protections where relevant, strict CORS allowlists, OAuth state/PKCE, token expiry/revocation, rate limiting and audit logging.
- For Docker: maintained base images, reproducible dependencies, non-root execution, minimal build contexts, isolated networks, health probes, correct signal handling and durable storage when needed.
- For CI/CD: least-privilege credentials, secret protection, tests and migration checks, dependency/image/config scans, immutable tested artifacts where feasible, and rollback documentation.
- Separate liveness from readiness. A health endpoint and a successful build do not prove production readiness.
- Check current provider docs for port contracts, TLS/proxy trust, supported runtimes, secret integration, networking, managed database access and data residency.

## Verification matrix

Select and run relevant checks:
- Unit/API tests for success, validation and error paths.
- Auth tests for duplicate/concurrent signups, bad credentials, expiry/revocation, recovery, verification, rate limits and OAuth callback integrity as applicable.
- Cross-user and cross-tenant authorization tests.
- Clean database initialization, schema-upgrade tests, constraints, and persistence across container restart.
- Container build/runtime smoke tests, non-root identity, readiness behavior, exposed ports and secret-safe logs.
- Static/dependency/image/IaC scans using Bandit, pip-audit, Trivy or appropriate alternatives.
- Cloud pipeline and live endpoint smoke checks only if deployment was authorized and actually performed.

Treat scanners as aids, not proof. Report exact commands, outcomes, environment and limitations.

## Currentness and evidence

For each relevant repository, inspect current README/docs, supported versions, releases/maintenance, license, security notices, dependencies and deployment instructions. Recheck FastAPI Users' maintenance status before relying on it. Separate observed facts from recommendations; never claim tests, deployment or security properties without evidence.
