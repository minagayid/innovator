# Innovator deployment readiness

**Current state: not deployable to production without infrastructure setup.** The repository build and tests pass, but the currently deployed Manus site is separate from this repository and is not connected to its deployment workflow.

## What the repository currently deploys

| Path | Actual behavior | What it does not do |
|---|---|---|
| `.github/workflows/pages.yml` | Builds and publishes the static research companion to GitHub Pages when changes reach `main` | Does not deploy the full application/API or provision storage |
| `cloudbuild.yaml` | Builds the Docker image and pushes it to Artifact Registry | Does not deploy a Cloud Run service |
| `Dockerfile` / `scripts/start.mjs` | Package and start the Workerd/Vite application container | Do not create D1/R2 resources or bind production secrets |
| Manus deployment | Hosts the current `innovator-lwqhbfbw.manus.space` prototype | Is not wired to this GitHub repository's branch or CI pipeline |

## Verified account prerequisites

Read-only checks of the connected accounts found:

- Cloudflare: no D1 databases and no Pages projects; R2 is not enabled.
- The generated Wrangler configuration contains a placeholder D1 database ID and an R2 bucket binding that does not exist in the connected account.
- Google Cloud: an existing project is present, but no billing account is linked. Cloud Run deployment would require the owner to enable billing first.
- No production deployment was attempted and no billable resource was created.

## Recommended deployment path

### Option A — Cloudflare (closest to the existing bindings)

1. Enable R2 in the Cloudflare dashboard.
2. Create a production D1 database and an R2 bucket.
3. Replace generated placeholder IDs/bucket names with the real resource bindings in the source deployment configuration.
4. Configure required environment variables and secrets in the Cloudflare project; do not commit them.
5. Create/connect a Pages or Workers project to the repository and configure the production build command.
6. Deploy a preview first, run the smoke-test checklist below, then promote to production.

### Option B — Google Cloud Run

1. Link a billing account to the existing Google Cloud project (owner action).
2. Create or verify Artifact Registry and the Cloud Run service account.
3. Add a Cloud Run deploy step after the image-push step in Cloud Build.
4. Resolve the application's D1/R2 bindings before deployment: Cloud Run does not automatically provide Cloudflare Worker bindings. Either use remote Cloudflare resources through a supported client or refactor persistence/storage to GCP services.
5. Configure OAuth and model-provider secrets, deploy to a preview service, and run the smoke tests.

Do not enable billing or create production resources until the owner selects the target and approves any associated costs.

## Required secrets and configuration

Store these only in the hosting provider's secret manager:

- OAuth client IDs/secrets for enabled sign-in providers.
- D1 database identifier and R2 bucket binding (Cloudflare route).
- Private Hugging Face read token if the application loads the private research models.
- Any optional model-serving endpoint credentials.
- Provider API credentials where required.

## Production smoke-test checklist

- [ ] Health endpoint returns HTTP 200 from the deployed container.
- [ ] Sign-in, sign-out and callback flows work for every enabled identity provider.
- [ ] Create, save, reload and delete a workspace; verify persistence across sessions.
- [ ] Run the full candidate-generation → prior-art research → committee review → test-plan workflow.
- [ ] Research responses expose per-source success/failure status and citations; provider failures must not appear as an empty successful search.
- [ ] Verify the patent adapter and multi-omics encoder are called only through an explicitly configured research endpoint; do not enable them as production defaults before evaluation.
- [ ] Verify tenant isolation, private workspace access and secret redaction.
- [ ] Run accessibility, mobile layout, load and error-recovery tests.

## Current release gate

The research-source diagnostics fix is in this PR. Production release remains blocked until a hosting target is selected, the required storage bindings and secrets are configured, and the smoke tests pass.