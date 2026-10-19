---
name: production-auth-and-data-boundaries
description: Harden production configuration, authentication, authorization, demo-data isolation, and storage boundaries during deployment work. Use when defaults, placeholder secrets, inactive accounts, token parsing, seed data, CORS, or sensitive user/clinical records could make an otherwise successful deployment unsafe.
---

# Production Auth and Data Boundaries

Deployment is not safe just because a service starts. Use this skill to review the app's trust boundaries and encode important assumptions in configuration checks and regression tests.

## Production configuration must fail closed

- Review environment settings, sample env files, configuration parsing, and startup behavior.
- Reject known placeholder/example secrets in production. Where a symmetric signing key is required, enforce an adequate minimum length and never print the received value. Explain how to provision a strong random secret through the secret manager.
- Reject unsafe production toggles such as debug mode, demo seeding, permissive wildcard origins, development-only database URLs, and unsecured origins where HTTPS is required.
- Require the production database driver/dialect actually used by the code. For PostgreSQL async applications, ensure the async driver is installed in the image and the configured URL selects it.
- Validate origins as origins—not arbitrary URLs with unexpected paths, credentials, wildcards, or insecure schemes. Test intended localhost exceptions separately from production policy.
- Keep defaults secure, explicit, and covered by tests. Production startup should fail with a useful safe error rather than silently falling back to development configuration.

## Authentication and authorization

- Test the full identity lifecycle: OAuth/state/callback validation where applicable, signed session cookies or token verification, logout/expiry, malformed subjects/claims, and error paths. Avoid home-grown cryptography; use maintained libraries and standard protocols.
- Reject login for disabled/inactive accounts, and ensure a token issued before deactivation cannot continue to access protected routes. Use generic externally visible errors where detailed reasons would enable account enumeration.
- Verify role-based and resource-level authorization on every sensitive route. Roles alone may not be sufficient: clinical records, tenant resources, projects, or files may need explicit assignments and ownership checks. Do not assume a UI filter is an access-control boundary.
- Make quota/rate-limit identity stable and tamper-resistant. When identifiers must be pseudonymized, use a server-side keyed HMAC rather than an unhashed email or a client-supplied identity; keep its key secret and version/rotation implications documented.
- Check session cookie flags, CSRF/state defenses, redirect validation, token lifetime, and log redaction. Never expose tokens, secrets, personal identifiers, or clinical content in logs or test failures.

## Demo and seed data isolation

- Keep invention examples, demos, fixtures, and seed source files in version control when the user wants them preserved.
- Prevent them from reaching production through explicit SEED_DEMO_DATA=false defaults, production config guards, non-importing production execution paths, and carefully chosen production Docker build contexts. An image ignore rule is safe only when excluded files are not required by production imports/build steps.
- Keep synthetic demo data for tests, but never run seeders against a real or shared production database. Test both the default-disabled path and rejection of attempts to enable demo seeding in production.
- For generated content systems, separate exemplar/seed records from new user-generated output so the deployment behaves as a generator rather than presenting examples as newly generated results.

## Sensitive records and persistence

- Check where uploads, reports, attachments, and generated files are stored. A container's local filesystem may be ephemeral and may not be shared between instances.
- For sensitive data, require object-level authorization before read, download, update, and delete; private storage, scoped signed URLs where appropriate, audit events, retention/deletion rules, and documented key/access management.
- Flag missing tenant or doctor-to-patient assignment boundaries, public buckets, unauthenticated endpoints, and incomplete audit trails as production blockers rather than treating them as minor deployment tasks.
- Avoid claiming clinical, legal, privacy, or regulatory readiness based only on code tests. Record where specialist/security/legal review is required before real personal or medical data is accepted.

## Verification checklist

- Invalid production configuration is rejected; valid configuration passes.
- Placeholder and weak secrets fail without echoing their values.
- Inactive users cannot log in, and pre-existing sessions/tokens are rejected after deactivation.
- Malformed token claims and unknown users produce controlled authorization failures.
- A user with one tenant/resource cannot access another user's records by changing IDs.
- Demo seeding is disabled by default and rejected under production configuration.
- Cross-origin access follows an explicit allow-list.
- Storage paths, access controls, backup/retention policy, and audit evidence are documented.

If a boundary cannot be safely tested or implemented within scope, describe it precisely and leave it as an explicit release gate.
