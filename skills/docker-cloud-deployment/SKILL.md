---
name: docker-cloud-deployment
description: Package and prepare web applications for Docker and cloud deployment, including multi-stage images, Compose dependencies, runtime configuration, secrets, migrations, health probes, persistent storage, and provider-specific launch contracts.
---

# Docker and Cloud Deployment

## Start from the actual platform contract

Inspect project runtime, dependency manager, entry point, static assets, database, required environment variables, ports, filesystem writes, health endpoints, and target cloud platform. Check current provider documentation for changing requirements such as supported runtimes, port binding, identity, managed database access, and startup limits.

## Container design

- Use a small maintained base image and a multi-stage build when it materially reduces runtime size or excludes build-only dependencies.
- Pin runtime/package inputs to the project's lock and reproducible version policy. Do not make the image depend on untracked local files.
- Copy only required files through an explicit Docker build context and .dockerignore. Avoid copying local environments, credentials, caches, Git history, tests or archives unless runtime genuinely needs them.
- Run as a non-root user, provide a deterministic working directory, and use an exec-form command with graceful signal handling.
- Do not bake secrets into build args, image layers, source files, or default environment values.
- Handle architecture, libc, native dependencies, certificate bundles, and healthcheck tools deliberately.

## Runtime and persistence

- Separate liveness from readiness. Readiness should check mandatory dependencies such as the database; liveness should not restart a healthy process merely because a dependency is briefly unavailable.
- Bind the expected interface and platform-provided port. Avoid assuming a fixed public port when the host supplies PORT.
- Treat container filesystems as ephemeral unless the platform explicitly provides durable storage. Use managed databases or supported persistent volumes for user data; plan backups and restore tests.
- Configure TLS termination, trusted proxy handling, CORS, allowed hosts, timeouts, request body limits, resource limits, and logging for the target platform.
- Compose local dependencies with service health conditions, named persistent volumes, explicit networks, and tested development defaults. Keep local-only defaults from weakening production security.
- Run database schema migrations as a serialized release step or one-shot job when multiple replicas could start concurrently; don't assume each app container should migrate the database independently.
- Ensure shutdown and deployments drain connections cleanly and the app recovers from transient dependency loss.

## Release checks

1. Review the full Dockerfile, Compose file, ignore rules, entrypoint, migration path, and runtime configuration for hidden network calls or destructive side effects before execution.
2. Build the exact image intended for deployment.
3. Start the container with a clean configuration and real required dependencies.
4. Probe liveness and readiness, create and authenticate an account if relevant, exercise a representative read/write action, and inspect logs for secrets or startup errors.
5. Restart the container and database where practical to check persistence. Test a database upgrade from the previous schema.
6. Check image size, non-root operation, dependency vulnerabilities, and exposed ports with the available tools.
7. Validate provider-specific configuration and document the real rollout and rollback procedure.

## Honest deployment status

A Dockerfile, Compose file, a passing local smoke test, or a green build is not a cloud deployment. Only report deployment after a confirmed platform action and a successful external health/functional check. State which secrets, DNS/domain, TLS, database, OAuth callback, monitoring, and rollback settings remain operator-owned.
