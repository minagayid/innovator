# Paid disclosure inference boundary

The disclosure route returns a deterministic demo response unless every paid-inference control is available. It requires a provider key, an explicitly enabled Cloudflare edge trust boundary, a rate-limit HMAC secret, and the shared D1 `DB` binding. Missing or failing controls keep the paid providers off for that request.

Set `DISCLOSURE_TRUST_CF_EDGE=true` only when requests reach this Worker through Cloudflare's edge. The route uses `cf-connecting-ip`; it does not treat `x-forwarded-for` or `oai-authenticated-user-email` as verified identity. Set `DISCLOSURE_RATE_LIMIT_HMAC_SECRET` to a random secret of at least 32 characters outside source control. The HMAC prevents raw caller IPs from being stored in D1.

The shared D1 limits are 4 requests per caller per hour, 12 per caller per day, 24 total requests per hour, and 120 total requests per day. Each provider call is capped at 512 output tokens and its response body at 32 KiB. Only one paid provider is attempted per request. Quota/schema errors return the deterministic demo response without calling a provider.

These application limits reduce repeated and aggregate spend; they do not prove a monthly financial ceiling or protect an origin that bypasses Cloudflare. Configure provider-side budget alerts and ensure there is no alternate public path to the Worker before enabling paid inference. The ChatGPT identity headers are trusted only in the separately authenticated ChatGPT ingress flow and are not used by this endpoint.

This configuration does not establish clinical, patentability, or other domain review. The generated disclosure remains an unverified drafting aid.
