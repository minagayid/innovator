# Provider and research setup

## Authentication

Innovator supports Google, GitHub, LinkedIn, and ORCID through signed, provider-specific OAuth sessions. Configure each provider’s client ID, client secret, and exact callback URL in the server environment. The callback paths are `/api/auth/google/callback`, `/api/auth/github/callback`, `/api/auth/linkedin/callback`, and `/api/auth/orcid/callback`. The session secret must be at least 32 characters. Provider tokens are exchanged server-side and are never placed in browser state or persisted as user credentials.

The temporary sandbox deliberately runs without provider credentials. In that mode the sign-in links return a clear 503 configuration response, while anonymous generation remains available through the deterministic fallback. Real provider sign-in should be verified only after registering the exact HTTPS callback URLs on the deployment host.

## Research sources

`GET /api/research?q=...` queries OpenAlex and Crossref in parallel, bounds the query and result set, deduplicates by normalized title, and returns source URLs, author names, venue, and year. Every record is labeled `evidence: sourced`, meaning the record came from the named API; it does not mean the source supports an invention claim. WIPO PATENTSCOPE remains a public live handoff rather than an automated scrape or legal prior-art opinion.

## AI roles

`POST /api/roles/invention`, `/api/roles/review`, and `/api/roles/orchestration` accept a bounded `brief`. With `OPENAI_API_KEY`, they use the configured server-side OpenAI Responses endpoint and return `mode: live` with a provenance record. Without a key, or when the provider fails, they return a deterministic role-specific scaffold with `mode: deterministic-fallback`. The fallback is intentionally useful for testing but never claims that research, novelty, safety, feasibility, or peer review occurred.

`POST /api/media-briefs` returns detailed concept-image, prototype-video, and validation-diagram prompts. These are creative handoffs for a downstream media system, not visual evidence that a proposed mechanism works.

## Temporary deployment boundary

The sandbox test deployment uses ephemeral local runtime state. It is suitable for UI/API smoke tests and public research navigation only. Do not use it as durable multi-user storage, and do not test with real user passwords, OAuth tokens, or production data. A durable deployment still needs host-managed secrets, exact OAuth callback registration, durable database/object storage, backups, and qualified domain review.
