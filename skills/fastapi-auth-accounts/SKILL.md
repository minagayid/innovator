---
name: fastapi-auth-accounts
description: Design or implement FastAPI account systems including registration, login, password handling, access and refresh sessions, OAuth/OIDC, user profiles, logout, and authorization. Use whenever authentication or personal user data is in scope.
---

# FastAPI Authentication and Accounts

## Start with the threat model

Inspect the current app, identity requirements, data sensitivity, client type, trusted origins, deployment model, and persistence before choosing token and cookie behavior. Define whether the API serves a same-site web app, a cross-origin SPA, mobile clients, or multiple clients. Do not copy an auth pattern without validating the transport and threat model.

## Account lifecycle

Plan and test the full lifecycle, not only successful signup and login:

- Registration with canonicalized email or identity; database uniqueness remains authoritative under concurrency.
- Login with generic failure messages that do not unnecessarily disclose whether an account exists.
- Secure password hashing using a maintained adaptive password-hashing library and parameter settings appropriate to the runtime.
- User profile access limited to the authenticated account, with ownership checks on every user-scoped object.
- Logout and server-side refresh-session revocation.
- Email verification and secure account recovery/password reset if password-based accounts are offered.
- External OAuth/OIDC when requested, including provider configuration, redirect allowlists, correlation state, PKCE where appropriate, issuer/audience/signature validation, and safe error handling.
- Account disablement/deletion, session invalidation, abuse controls, and audit events where the product needs them.

Do not represent email/password signup as production-ready when verification and recovery pathways are missing. If an identity lifecycle requirement cannot be implemented in scope, mark it as a production blocker or explicit deferment.

## Credential and session handling

- Keep secrets and signing keys in a managed secret store or runtime environment; never commit credentials, bake them into images, log them, or expose them to the browser.
- Use short-lived access credentials. Prefer opaque, high-entropy refresh tokens with rotation and replay/reuse detection; persist only a cryptographic hash of refresh-token material when feasible.
- If refresh tokens use cookies, set HttpOnly, Secure in production, an intentional SameSite policy, a narrow Path/Domain scope, expiration, and revocation. Evaluate CSRF protection based on browser transport and SameSite/cross-origin configuration.
- Keep browser access tokens in memory where that matches the application architecture; avoid localStorage for long-lived bearer credentials.
- Never put bearer tokens or secrets in query-string parameters. OAuth callback design must validate state/PKCE and carefully minimize token exposure; use a secure code exchange where architecture permits.
- Configure CORS from a strict origin allowlist and never combine credentialed requests with wildcard origins.
- Apply rate limits to login, signup, recovery, verification, refresh, and OAuth callback endpoints. Multi-instance deployments need a shared rate-limit backend rather than relying solely on per-process memory.
- Do not log passwords, raw refresh tokens, reset tokens, authorization headers, or unnecessary personal data.

## FastAPI implementation practices

Use Pydantic request/response models so password fields and internal columns cannot accidentally leak through serialization. Keep configuration validation centralized and fail closed for insecure production settings. Use dependency-based authentication and explicit authorization checks. Treat health endpoints separately from account routes; readiness should reflect required dependencies while liveness remains a process-health signal.

Use async or sync SQLAlchemy deliberately rather than mixing patterns accidentally. Ensure password verification, token issuance, cookie handling, database transactions, refresh rotation, and logout revocation have clearly defined failure behavior. Model refresh sessions by owner, token hash, creation/expiry, revocation, and relevant audit timestamps.

## Minimum test matrix

Include successful paths and negative cases:

- Duplicate accounts under normalized email forms and concurrent registration.
- Wrong password, malformed input, disabled account, and generic authentication errors.
- Missing, expired, invalid-signature, wrong-audience, and wrong-subject tokens where applicable.
- Cross-user profile/object access attempts.
- Refresh token rotation, reuse, expiry, logout, and revocation.
- Cookie attributes, CORS rejection, rate limit behavior, and production configuration validation.
- OAuth state/PKCE mismatch, denied consent, untrusted redirect, missing provider configuration, and callback failure.
- Migration from the previous schema and clean database initialization.

## Production contract

Before calling auth production-ready, verify email verification and recovery, shared abuse/rate-limiting controls, key rotation, token/session retention, audit-log policy, transport security, and account-deletion behavior or clearly record approved product-specific alternatives. A successful local login test alone is not evidence of a secure identity system.
