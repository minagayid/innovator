# Paid inference boundary

The disclosure route and the role routes (`/api/roles/invention`, `/api/roles/review`, and `/api/roles/orchestration`) return deterministic responses unless every paid-inference control is available. A provider key, an authenticated application identity or explicitly enabled Cloudflare edge trust boundary, a rate-limit HMAC secret, and the shared D1 `DB` binding are required before a configured provider is called. Missing or failing controls keep paid providers off for that request.

Set `DISCLOSURE_TRUST_CF_EDGE=true` only when requests reach this Worker through Cloudflare's edge. The routes use `cf-connecting-ip`; they do not treat `x-forwarded-for` or `oai-authenticated-user-email` as verified identity. Set `DISCLOSURE_RATE_LIMIT_HMAC_SECRET` to a random secret of at least 32 characters outside source control. The HMAC prevents raw caller IPs from being stored in D1.

The shared D1 limits are 4 requests per caller per hour, 12 per caller per day, 24 total requests per hour, and 120 total requests per day. Each provider call is capped by the route's output-token limit and bounded response body. Quota/schema errors return the deterministic response without calling a provider. Disclosure and role calls share this conservative budget.

These application limits reduce repeated and aggregate spend; they do not prove a monthly financial ceiling or protect an origin that bypasses Cloudflare. Configure provider-side budget alerts and ensure there is no alternate public path to the Worker before enabling paid inference. This configuration does not establish clinical, patentability, safety, or other domain review. Generated disclosures, role results, and research records remain unverified drafting aids or navigation records.
