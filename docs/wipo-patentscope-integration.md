# WIPO PATENTSCOPE integration

Innovator now provides a public-search handoff from every generated invention candidate. The handoff combines the candidate title, technical field, and model-suggested keywords into a bounded query and opens WIPO's public PATENTSCOPE search interface in a new tab.

This is deliberately a link-out integration. WIPO's official PATENTSCOPE data-services page describes programmatic PCT document access as a fee-based SOAP web service. The public PATENTSCOPE search interface is available without that paid service, so the free trial does not scrape, mirror, or redistribute WIPO search results.

The handoff must not be described as a prior-art search result, novelty assessment, patentability opinion, freedom-to-operate analysis, or legal advice. Users should inspect the live results and obtain qualified patent counsel where appropriate.

## Hugging Face model

The server-side disclosure route already supports Hugging Face Inference Providers through `https://router.huggingface.co/v1/chat/completions`. Set `HF_TOKEN` as a server secret and optionally set `HF_MODEL`; the default is `Qwen/Qwen3-4B-Instruct-2507:fastest`. The token never belongs in browser code or source control.

Hugging Face's current pricing documentation says free users do not receive included Inference Provider credits. A trial therefore needs either a token/account with available purchased credits or a provider/model path that the account can access at no charge. Innovator fails back to its deterministic local scaffold when the provider is unavailable; it does not silently claim that model output was produced.

## Free trial deployment

The repository's static GitHub Pages companion is free but cannot run the server-rendered disclosure API, persistence, Google sign-in, or server-side Hugging Face token. It is suitable for the research archive only.

For a full public trial, use a free-tier server host that can build the existing Docker image or a managed WebDev deployment. Keep `HF_TOKEN`, `AUTH_SESSION_SECRET`, and any Google OAuth secrets in the host's secret manager. Do not put them in a Dockerfile, GitHub Pages artifact, client bundle, or checked-in `.env` file. The current Google Cloud guide remains a preview path only unless the D1/R2 storage boundary is migrated to durable Cloud services.

## Sources

- [WIPO PATENTSCOPE](https://patentscope.wipo.int/search/en/search.jsf)
- [WIPO PCT Data Products and Services](https://www.wipo.int/en/web/patentscope/data/index)
- [Hugging Face Inference Providers pricing](https://huggingface.co/docs/inference-providers/en/pricing)
- [Hugging Face chat completion API](https://huggingface.co/docs/inference-providers/en/tasks/chat-completion)
