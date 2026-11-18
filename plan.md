# Innovator hardening release

## Goal
Turn the existing generator-first vertical slice into a credible research studio without weakening its evidence boundary or deterministic offline behavior.

## Implementation
- Preserve the current structured disclosure contract, quotas, D1/R2 persistence, WIPO PATENTSCOPE link-out, and deterministic fallback.
- Generalize the signed session reader to support Google, GitHub, LinkedIn, and ORCID while retaining provider-specific OAuth state and callback validation.
- Add public research adapters for OpenAlex and Crossref, with bounded query parsing, timeout handling, deduplication, source URLs, and an explicit `source`/`evidence` label on every result.
- Add three bounded AI role endpoints: invention design, research and peer-review committee, and orchestration. Each role uses the configured server-side provider when available and returns a deterministic, clearly labeled fallback otherwise.
- Add an image-brief endpoint that returns detailed, evidence-safe concept-image prompts rather than implying generated artwork is proof.
- Add a compact research desk to the main UI so users can search research and request review/orchestration from the same workspace.
- Keep all provider secrets server-side and document callback URLs and deployment requirements.

## Design
Use the existing restrained field-notebook visual language: dark green ink, warm paper surfaces, serif editorial headings, thin rules, and explicit evidence labels. Avoid generic chatbot chrome and avoid claims of novelty, patentability, safety, or validation.

## Project structure
- `app/auth/`: signed session and OAuth provider contracts.
- `app/api/auth/`: provider start/callback/logout routes.
- `app/api/research/`: OpenAlex and Crossref search adapter.
- `app/api/roles/`: invention, research-review, orchestration, and media-brief endpoints.
- `app/api/*/input.ts`: bounded request parsing.
- `app/ai/`: provider-neutral role prompts and deterministic fallbacks.
- `tests/`: contract, parser, provider, and route smoke tests.

## Validation
Run build, lint, the existing suite, new contract tests, production startup smoke tests, and a temporary localhost HTTP smoke check. External OAuth sign-in is verified by configuration and safe redirect behavior unless provider credentials are supplied; no real user credentials are stored or fabricated.
