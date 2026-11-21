# Live Innovator site audit

**Target:** https://innovator-lwqhbfbw.manus.space/  
**Audit date:** 2026-11-21  
**Scope:** deployed UI, candidate-generation flow, committee review, research endpoint and deployment linkage.

## Observed workflow

| Stage | Result | Finding |
|---|---|---|
| Candidate generation | Works for a synthetic prompt | The page can create a candidate using its current fallback flow; model-backed drafting is not configured. |
| Committee review | Runs | The tested candidate produced 4 blocking flags and 13 open repair tests. This is useful feedback, not evidence of invention validity. |
| Prior-art research | Incomplete | A GET request to `/api/research?q=...` returned HTTP 200 with an empty result set and no per-source status/error details. A POST request returned 405. |
| Test planning | Partial | The workflow proposes a test plan, but no executed test measurements or pass/fail evidence were demonstrated. |
| Save/load workspace | Not verified | The UI asks the user to sign in to save privately; an authenticated save/reload cycle was not completed in this audit. |
| Production deployment | Not verified | The Manus-hosted site is separate from the repository's GitHub Pages and Cloud Build workflows. |

## Findings

### Critical — silent research failure
The deployed research endpoint can return an empty result set with HTTP 200 and no provider-health information. A user cannot distinguish “no relevant prior art” from “provider unavailable” or “provider returned an error.”

**Repository fix:** PR #15 adds per-source status, sanitized failure details, non-2xx handling and partial-provider-success behavior, with regression tests.

### High — model-backed drafting is not configured
The live workflow does not demonstrate a configured model endpoint. The current candidate-generation fallback should not be described as an integrated patent-trained model.

**Required:** configure an authenticated inference service, record the model/base-model version and prompt/config, and add quality/safety evaluation before enabling it.

### High — prior-art evidence is not sufficient
The observed research response contains no sourced records. A real invention workflow needs traceable patent/publication references, dates, claim/abstract excerpts and provenance. Search failure must be visible.

### High — test stage is planning-only
The tested flow proposes a test plan but does not demonstrate execution, measured results, reproducibility or pass/fail tracking.

### Medium — persistence and access control not verified
The site advertises private saved workspaces after sign-in, but this audit did not complete the authentication and save/reload cycle. Verify tenant isolation and authorization before production use.

### High — full application deployment path is missing
The current Manus site is not connected to the repository deployment pipeline. The repository's GitHub Pages workflow publishes only a static research companion; Cloud Build builds/pushes an image but has no Cloud Run deploy step. The connected Cloudflare account has no D1 or Pages project and R2 is not enabled; the existing Google Cloud project has no billing account.

See [deployment readiness](./deployment-readiness.md) for the verified prerequisites and deployment options.

## Recommended release gates

1. Show provider health and citations in every research result; distinguish empty results from provider errors.
2. Connect a versioned model endpoint and log the model, prompt and source evidence for each generated candidate.
3. Add prior-art retrieval benchmarks, citation correctness checks and novelty false-positive review.
4. Execute at least one test plan and persist the measurements, raw evidence and pass/fail outcome.
5. Verify authentication, workspace save/reload/delete, tenant isolation and private artifact access.
6. Provision a real hosting target, configure secrets and storage bindings, then pass the production smoke-test checklist.

**Audit conclusion:** the deployed site is a useful interactive prototype, but it is not yet a complete, evidence-backed invention workflow or a verified production deployment.