---
name: cloud-run-containerization
description: Diagnose and harden Dockerfiles, build contexts, image contents, Cloud Build configuration, Cloud Run port/startup contracts, and reverse-proxy behavior. Use when a container fails to build, exits at startup, cannot reach dependencies, or needs a safer repeatable Google Cloud deployment path.
---

# Cloud Run Containerization

Use this skill to repair container/build/deployment contracts from evidence rather than assuming the Dockerfile is the only possible cause.

## Inspect every build context

For each build command, document the context directory separately from the Dockerfile path. The active context determines which .dockerignore applies and which files Docker can copy. Check root-context builds and nested application builds independently.

- Confirm required source, runtime assets, compiled outputs, certificates, templates, and migrations are available inside the context.
- Exclude local .env files, credentials, caches, VCS metadata, local databases, uploads, and test-only data as appropriate.
- Do not exclude files required at build time or module-import time. If seed or sample data must remain in Git but stay out of a production image, first verify the production code path never imports it; make seeding explicitly opt-in and test that behavior. Keep separate local/demo builds usable when required.
- Inspect image contents indirectly through build logs, file checks, or an explicit test. Do not dump secret-bearing layers or environment values.

## Make the container contract explicit

- Install every dependency set needed by the chosen production entry point. For split dependency files, verify the production image installs all required runtime manifests; keep development and test dependencies out when practical.
- Start the application with the platform's intended command. The server must bind to 0.0.0.0 and the port contract must be consistent across the runtime, container, proxy, Compose file, health probes, and deployment documentation.
- On Cloud Run, use the platform-injected PORT contract (commonly 8080) rather than hard-coding an unrelated application port. Do not attempt to pass PORT through generic --set-env-vars flags. Configure the service's container port via the supported deployment setting when needed.
- Prefer a non-root runtime user, a minimal maintained base image, deterministic package installation, and a clear working directory. Avoid introducing root-owned runtime directories that prevent the service from writing required temporary data.
- Do not assume Dockerfile HEALTHCHECK is the same as a configured Cloud Run startup or liveness probe. Verify a real health endpoint and configure platform probes separately when required.

## Cloud Build and image publishing

- Build images from the same context and Dockerfile that CI verifies. Check that cloudbuild.yaml substitutions, Artifact Registry repository/region, image names, and build arguments agree with the deployment guide.
- Tag deployable images with an immutable commit SHA or release version. Do not use only a mutable latest tag as the release identity.
- Use least-privilege build and runtime service accounts. Store credentials and signing keys in Secret Manager or the approved secret system; never bake secrets into ARG, ENV, source maps, layers, or logs.
- Keep build and runtime permissions distinct where possible. Document required APIs, IAM roles, Artifact Registry access, Cloud SQL connectivity, and other infrastructure prerequisites without granting broad roles by default.

## Reverse proxy and multi-container checks

For NGINX or another proxy in front of an API:

- Verify the proxy actually listens on the injected/declared port; use a tested template or startup substitution when the server configuration cannot interpolate environment variables directly.
- Check API and WebSocket paths, upstream hostname and port, forwarded host/protocol headers, request-body limits, timeout policy, and path rewriting.
- If the upstream uses HTTPS, preserve SNI and certificate verification. Do not silently disable TLS verification to make deployment pass.
- Test the proxy using a real running container and an explicit home-page/API route. A successful frontend asset build alone does not prove the runtime configuration is valid.

## Required verification

1. Build every supported image from its real context.
2. Start the exact image locally or in CI with synthetic configuration and verify it stays running.
3. Request the health endpoint and at least one representative API/user flow.
4. Verify expected port listening, upstream DNS/service aliases, and database connection behavior.
5. Run a frontend build and proxy smoke test if a separate frontend image exists.
6. Validate the Cloud Build and deploy commands against current repository configuration; keep secrets as placeholders.
7. Capture the precise log/test result and distinguish a local build from a cloud build or a live deployment.

## Common failure patterns

- A production requirements file exists but the Dockerfile installs only the development file (or vice versa).
- Root build ignores and nested build ignores differ, leading to inconsistent images.
- A Dockerfile uses an invalid health-check instruction form.
- A CI database URL points to a hostname different from the actual container/network alias.
- Compose maps a host port to a container port the process never listens on.
- A Cloud Run deploy command tries to set a platform-reserved PORT variable manually.
- NGINX listens on a fixed port while Cloud Run expects a different port, or upstream TLS is configured without correct SNI.

Do not fix these by weakening TLS, exposing databases publicly, hard-coding secrets, or deleting source data.
