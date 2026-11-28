# Provider and research setup

## Authentication

Innovator supports Google, GitHub, LinkedIn, and ORCID through signed, provider-specific OAuth sessions. Configure each provider’s client ID, client secret, and exact callback URL in the server environment. The callback paths are `/api/auth/google/callback`, `/api/auth/github/callback`, `/api/auth/linkedin/callback`, and `/api/auth/orcid/callback`. The session secret must be at least 32 characters. Provider tokens are exchanged server-side and are never placed in browser state or persisted as user credentials.

The temporary sandbox deliberately runs without provider credentials. In that mode the sign-in links return a clear 503 configuration response, while anonymous generation remains available through the deterministic fallback. Real provider sign-in should be verified only after registering the exact HTTPS callback URLs on the deployment host.

## Research sources

`GET /api/research?q=...` queries OpenAlex and Crossref in parallel, bounds the query and result set, deduplicates by normalized title, and returns source URLs, author names, venue, and year. Every record is labeled `evidence: sourced`, meaning the record came from the named API; it does not mean the source supports an invention claim. WIPO PATENTSCOPE remains a public live handoff rather than an automated scrape or legal prior-art opinion.

## AI roles

### Optional Kilo free model for disclosure

Set `KILO_FREE_ENABLED=true` on the server to offer the fixed `baidu/ernie-5.5-flash-preview:free` model through Kilo's anonymous gateway. The user must also opt in for each draft in the form; Kilo requests never fall through to another provider. Requests remain behind Innovator's existing identity, HMAC and shared D1 quota gate. The model may become unavailable or rate-limited, in which case the app returns a deterministic scaffold. Kilo's free tier is experimental and may log or use submitted material. Do not send confidential inventions, secrets, health information or personal data. See [Kilo authentication](https://kilo.ai/docs/gateway/authentication) and [model terms](https://kilo.ai/docs/gateway/models-and-providers). The fixed requested model is recorded, but the actual serving model is not independently verified.

### Optional FreeLLMAPI router

Innovator can call a separately hosted [FreeLLMAPI](https://github.com/tashfeenahmed/freellmapi) instance using its OpenAI-compatible chat endpoint. This is an experimental, opt-in integration; installing this app does not provide a router, provider accounts, or free API keys. Configure the router with your provider keys and an appropriately restricted model chain, then set these server-only environment variables:

```text
FREELLMAPI_BASE_URL=https://your-secure-router.example/v1
FREELLMAPI_API_KEY=<router-unified-key>
FREELLMAPI_MODEL=auto
```

The base URL must use HTTPS and have no credentials, query string, or fragment. Protect the router with access controls and TLS; never place its key in the browser or source control. Innovator's existing authenticated identity and shared D1 quota gate still applies. Selecting the router takes priority for disclosure and roles; missing configuration, an error, or an invalid response produces the deterministic fallback without trying a second provider. The static GitHub Pages companion cannot run this server-side integration. `auto` routes according to the router's own chain and may fan out or retry across providers. Free-tier eligibility and limits are controlled by those providers; configure only eligible models and provider-side spending limits and verify pricing before use. Router quality, availability and confidentiality depend on the upstream services, and FreeLLMAPI describes itself as personal experimental software rather than a production inference platform.

`POST /api/roles/invention`, `/api/roles/review`, and `/api/roles/orchestration` accept a bounded `brief`. With `OPENAI_API_KEY`, they use the configured server-side OpenAI Responses endpoint and return `mode: live` with a provenance record. Without a key, or when the provider fails, they return a deterministic role-specific scaffold with `mode: deterministic-fallback`. The fallback is intentionally useful for testing but never claims that research, novelty, safety, feasibility, or peer review occurred.

`POST /api/media-briefs` returns detailed concept-image, prototype-video, and validation-diagram prompts. These are creative handoffs for a downstream media system, not visual evidence that a proposed mechanism works.

## Temporary deployment boundary

The sandbox test deployment uses ephemeral local runtime state. It is suitable for UI/API smoke tests and public research navigation only. Do not use it as durable multi-user storage, and do not test with real user passwords, OAuth tokens, or production data. A durable deployment still needs host-managed secrets, exact OAuth callback registration, durable database/object storage, backups, and qualified domain review.

