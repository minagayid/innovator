# Full-stack Engineering Skill Set

A reusable seven-skill package set for delivering a modern web application from UI refinement through backend identity, persistence, containerization, verification, and a transparent deployment-readiness decision.

This suite distills the recurring work pattern from the Genopedia delivery tasks: first inspect the existing application, improve the frontend within its requested boundary, then implement API/auth/user-data needs, prepare reproducible Docker/cloud configuration, test the integrated result, and report limitations without overstating deployment status. The skills are reusable for other applications; project-specific details are examples, not mandatory architecture.

## Skills and triggers

| Skill | Use it when | Main output |
|---|---|---|
| [fullstack-product-delivery](fullstack-product-delivery/SKILL.md) | Multiple connected app layers or a substantial deployment-ready request | Acceptance contract, routed workstreams, integration plan, evidence-backed handoff |
| [modern-frontend-ux](modern-frontend-ux/SKILL.md) | Visual polish, responsive pages, forms, accessibility, interaction states | Consistent UI with verified states and responsive/accessibility review |
| [fastapi-auth-accounts](fastapi-auth-accounts/SKILL.md) | FastAPI login/signup, user profiles, sessions, OAuth or account lifecycle | API/auth design, security controls and positive/negative tests |
| [data-models-and-migrations](data-models-and-migrations/SKILL.md) | SQLAlchemy/PostgreSQL models or schema evolution | Reviewed schema, migration/rollback approach and data-integrity tests |
| [docker-cloud-deployment](docker-cloud-deployment/SKILL.md) | Docker images, Compose, secrets, runtime health and cloud preparation | Reproducible container configuration and deployment/rollback checks |
| [integration-testing-ci](integration-testing-ci/SKILL.md) | Behavior changes, test design, CI, build and smoke checks | Observable test gates and trustworthy current-revision results |
| [production-readiness-audit](production-readiness-audit/SKILL.md) | Final go/no-go review before public release | Findings by severity, evidence, owners, launch blockers and status |

## Recommended routing order

1. Invoke fullstack-product-delivery to clarify the current scope and inspect repository structure.
2. Use modern-frontend-ux only for the UI boundary the user approved. Establish API contracts before frontend/backend integration.
3. Use fastapi-auth-accounts and data-models-and-migrations for identity and persistence changes; decide schema, cookie, token and callback contracts before implementation.
4. Use docker-cloud-deployment after entry points, dependencies, required environment, health behavior and persistence needs are known.
5. Use integration-testing-ci throughout development, not only at the end.
6. Finish with production-readiness-audit. Report email verification, recovery, shared rate limiting, monitoring, backups, retention, OAuth credentials and operator configuration as incomplete unless evidence says otherwise.

## Shared operating principles

- Use an acceptance ledger for substantial requests. Requirements must map to tests, named manual reviews, or explicit blockers/deferments.
- Inspect repository instructions and commands before execution. Preserve unrelated work and avoid destructive or external actions without authorization.
- Treat the frontend, API, database and deployment as one integrated system with explicit contracts.
- Use tests that observe real behavior and include negative/security cases. A successful build does not prove correct authorization or production safety.
- Separate local verification, CI verification, and real cloud deployment. Never claim a deployment without a confirmed platform result and an external smoke check.
- Use feature branches and pull requests for reviewable changes. Do not merge without explicit authorization.
- Apply the four-pass loop proportionally: implement, expert review, defect hunt, then polish and reverify.
- Report only checks actually run and distinguish verified behavior, inference, assumption, and unresolved risks.

## Related workflows

The repository's [Unlazy-inspired workflow router](../skills.md/eureka_skill/skills/unlazy-workflow/SKILL.md) and [acceptance-gate skill](../skills.md/eureka_skill/skills/unlazy-acceptance-gates/SKILL.md) provide deeper planning, gate, orchestration, and completion-audit practices. They adapt the upstream [Unlazy repository](https://github.com/Leonxlnx/unlazy); this skill set does not assume its executable checker or hooks are installed.
