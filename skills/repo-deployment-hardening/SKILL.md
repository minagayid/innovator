---
name: repo-deployment-hardening
description: Coordinate a production-readiness remediation for an existing repository, especially when Docker or Google Cloud Run deployment fails. Use to inspect the project, preserve demo/invention data while excluding it from production, harden runtime/auth boundaries, add CI evidence, document deployment, and prepare a reviewable branch and PR.
---

# Repository Deployment Hardening

Use this skill when asked to diagnose and fix deployment blockers across an application repository. It orchestrates the more focused skills in this directory; it is not a substitute for inspecting the actual repository.

## Operating rules

- Start from the repository's current default branch and its local instructions. Identify the stack, build contexts, entry points, dependency manifests, runtime port, database, authentication model, workflows, and current deployment guide before editing.
- Preserve existing user work, inventions, sample records, seed modules, uploaded files, and other source assets. When demo material must not appear in production, separate source retention from runtime/image inclusion; prefer disabled production seeding and a verified build-context boundary over deletion.
- Use the smallest coherent changes that fix the demonstrated cause. Do not rewrite product features just because deployment work exposes unrelated defects.
- Do not read, print, copy, or commit credentials, user secrets, real patient/customer records, or private browser state. Use placeholders in docs and synthetic records in tests.
- Make a dedicated feature branch, focused commits, and an open pull request. Do not merge or run a real cloud deployment without explicit authorization for that action.
- Treat local tests, CI builds, published image builds, and a successful live cloud deployment as distinct evidence levels.

## Workflow

1. **Map the deployment contract.** Read Dockerfiles, ignore files, Compose files, build pipelines, app start scripts, runtime configuration, health endpoints, environment examples, and deployment docs. For each Docker build, record the exact context directory, Dockerfile, installed dependency sets, expected command, listening address/port, and files that must be present.
2. **Reproduce and rank blockers.** Tie each issue to a specific file/configuration path, failure symptom, and verification step. Separate build-time failures, container-start failures, service-connectivity failures, auth/authorization issues, and product/data risks.
3. **Fix container and cloud configuration.** Follow [cloud-run-containerization](../cloud-run-containerization/SKILL.md). Check root and nested build contexts independently, port contracts, dependency completeness, non-root execution, health-check semantics, reverse proxies, image tags, secret injection, and database connectivity.
4. **Harden runtime configuration and boundaries.** Follow [production-auth-and-data-boundaries](../production-auth-and-data-boundaries/SKILL.md). Enforce safe production defaults, reject placeholder credentials, validate tokens and account state, constrain origins, keep seed data opt-in, and document authorization/storage gaps instead of hiding them.
5. **Build decisive tests.** Follow [deployment-evidence-and-smoke-tests](../deployment-evidence-and-smoke-tests/SKILL.md). Add regression coverage for each root cause; exercise a disposable database and real container where feasible; smoke-test frontend routing and the backend API; run the repository's CI.
6. **Document the actual deployment path.** Include commands for image builds and deployment, required APIs/resources, least-privilege service accounts, Secret Manager use, database configuration and networking, CORS/origins, health checks, rollback, and verification. Do not set cloud-reserved variables such as PORT using generic environment-variable flags when the platform owns them.
7. **Perform a final diff audit.** Check changed-file scope, secrets, destructive behavior, broken imports caused by image exclusions, CI evidence, documentation consistency, and whether any test is using a fake service in place of the real dependency it claims to cover.
8. **Publish review evidence.** Commit to the feature branch and open a PR. Report the commit, PR URL, exact CI run/check statuses, tests run, unsupported checks, and remaining blockers. Leave the PR unmerged unless authorized.

## Deployment proof levels

Use precise wording:

- **Static review:** files and configuration were inspected; runtime behavior not yet executed.
- **Unit/integration tests:** listed commands passed in the named environment.
- **Container verification:** the exact image built and its smoke tests passed.
- **Cloud pipeline verification:** the provider build pipeline completed successfully.
- **Live cloud verification:** a named deployed service was reached and tested against its actual configuration.

A passing Docker build does not prove a service has been deployed. A passing GitHub Actions workflow does not prove Google Cloud resources, IAM, secrets, networking, DNS, or billing are configured correctly.

## Completion gate

Before calling the work complete, provide:

- A short list of root causes and the changes made.
- A check/evidence table identifying command or CI run, status, and limitations.
- The branch, commit, and PR links.
- Explicit statements about whether a real cloud deployment occurred.
- Open production-readiness risks, data-retention or authorization gaps, and recommended human approvals.

Stop short of a production-ready claim when user data isolation, persistent storage, authorization, audit trails, privacy obligations, or rollback remain unresolved.
