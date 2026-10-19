---
name: deployment-evidence-and-smoke-tests
description: Design and run a deployment-focused verification matrix across unit tests, database integration, backend/frontend Docker images, reverse proxies, and CI. Use to prove specific container and deployment fixes and to report evidence without overstating cloud readiness.
---

# Deployment Evidence and Smoke Tests

Build a short, decisive test matrix around the actual failure modes in the repository. Prefer tests that would fail before the fix and pass after it.

## Verification ladder

1. **Static/configuration checks:** syntax, lint, lockfile consistency, production defaults, environment validation, route contracts, required files, Dockerfile/Cloud Build configuration.
2. **Focused unit tests:** exercise the changed configuration/authentication/data-boundary logic, including negative cases.
3. **Database integration:** use an isolated disposable database and a known network alias. Verify startup/health, schema/migration readiness, representative writes and reads, login/token issuance, role restrictions, and an authenticated current-user endpoint. Do not point tests at production or shared databases.
4. **Backend image:** build with the intended Dockerfile and exact context; start the image with synthetic settings; inspect health and application startup; validate that runtime dependencies are present.
5. **Frontend image/proxy:** run the frontend build, build the image, start the container, fetch its main page, and verify API/WebSocket proxy behavior where applicable. Check container ports, TLS/upstream settings, and request-size limits.
6. **CI as the final branch gate:** inspect the new commit's workflow run and each relevant job/check. A successful workflow must correspond to the exact commit being proposed, not a prior commit or another branch.
7. **Cloud-only checks, when authorized and available:** provider build, deployment, live health, auth, routing, secret/database access, and rollback verification. If cloud credentials/project access are absent, state that this level was not run.

## Regression-driven repair loop

For every reproduced issue:
- Record the failure symptom and probable cause before changing code.
- Add or update a test that expresses the required behavior.
- Make the smallest fix that addresses the cause.
- Re-run the focused test immediately.
- Then re-run the complete relevant suite and the exact image build/smoke test.
- Finally inspect CI on the resulting commit and review changed files for unrelated modifications.

A test should be meaningful: checking that a Dockerfile contains the word PORT is weaker than building and running the image with the platform port set. Use static contract tests as a fast guard, not as a replacement for runtime smoke tests.

## Integration-test details

- Use disposable services inside a dedicated CI network; refer to database services by the hostname actually assigned to them.
- Wait for readiness with bounded retries and print sanitized diagnostics on failure. Avoid timing-only sleeps when a readiness probe is available.
- Use synthetic account/user data and unique test identifiers.
- Validate both permitted and forbidden behavior (for example, patient registration/login succeeds while a prohibited self-service role assignment is denied).
- Verify that authorization is enforced by the API, not just by the frontend.
- Clean up temporary services and data even when a check fails.
- Ensure proxy checks use a real container process; source compilation alone will not catch invalid NGINX directives or missing template variables.

## Evidence record

For every claimed check, record the exact command or workflow/job, commit SHA, status, and important limitation. Use passed/failed/skipped/not available consistently. Do not say “tested” without naming the test or CI evidence.

Distinguish carefully between:
- tests completed in the local environment;
- GitHub Actions checks;
- a Cloud Build image build;
- an image pushed to Artifact Registry;
- a running Cloud Run service that was contacted and tested.

Do not infer that deployed infrastructure is functional because its deployment YAML parses or the container image builds.
