# Delivery checklist

## Auth and identity
- [x] Support Google, GitHub, LinkedIn, and ORCID OAuth start/callback flows with signed state, provider-specific cookies, safe return paths, and verified email handling.
- [x] Preserve ChatGPT ingress behavior and fail closed when trusted identity or session configuration is absent.
- [x] Add provider configuration and test-mode guidance without fabricating real credentials.

## Research and patents
- [x] Keep WIPO PATENTSCOPE as an evidence-bounded live handoff.
- [x] Add bounded OpenAlex and Crossref research/journal search with source links and evidence labels.
- [x] Surface research results in the main studio UI.

## AI roles
- [x] Add invention-generation role with structured output and deterministic fallback.
- [x] Add research and peer-review committee role with explicit objections, tests, and unresolved items.
- [x] Add orchestration role that routes a brief through research, invention, review, and next-test stages.
- [x] Add detailed image-brief generation that remains a creative handoff, not validation evidence.

## Quality and delivery
- [x] Build, lint, existing tests, new contract tests, production-start smoke test, and temporary HTTP smoke test pass.
- [x] Create a temporary test deployment only from the isolated sandbox copy; no production credentials or durable user data were used.
- [ ] Commit and push the validated changes to the repository’s main branch.

Validation evidence: `pnpm build`, `pnpm lint`, and `pnpm test` pass; the standard suite reports 42 behavioral tests and 9 deployment/smoke tests passing. The final temporary runtime passed `/healthz`, `/api/session`, `/manus-routes.json`, role fallback, and a live OpenAlex/Crossref search returning 10 records.
