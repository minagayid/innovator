# Google Cloud deployment

This directory contains the Cloud Run deployment script for an Innovator trial. It builds the root `Dockerfile`, pushes an immutable image to Artifact Registry, stores runtime credentials in Secret Manager, and deploys a public HTTPS Cloud Run service with an unauthenticated `/healthz` probe.

## Trial architecture

Use Cloud Run for a controlled preview of the generator and Hugging Face integration. Cloud Run supplies the `PORT` environment variable, and the container listens on `0.0.0.0`. TLS terminates at Cloud Run. `HF_TOKEN`, Google OAuth credentials, the session-signing secret, and the quota HMAC secret are injected from Secret Manager at runtime.

Cloud Run's writable filesystem is ephemeral. The current Innovator persistence layer uses Cloudflare D1/R2-compatible bindings through Wrangler/Miniflare. That is suitable for a disposable preview but is not durable shared storage on Cloud Run. Do not advertise the Cloud Run preview as a durable multi-user workspace until the storage layer is migrated.

## Required one-time setup

1. Create or select a Google Cloud project and enable billing.
2. Install and authenticate the Google Cloud CLI with permission to use Cloud Run, Cloud Build, Artifact Registry, IAM, and Secret Manager.
3. Create a Google OAuth Web application. The callback must be the final Cloud Run URL plus `/api/auth/google/callback`; register it after the first deployment and then redeploy with `GOOGLE_REDIRECT_URI`.
4. Create a fine-grained Hugging Face token with Inference Providers permission. Hugging Face account credits and provider availability apply.
5. Decide whether to restrict access with `GOOGLE_ALLOWED_EMAILS`.

## Deploy

```bash
export PROJECT_ID="your-gcp-project"
export REGION="us-central1"
export HF_TOKEN="hf_..."
export GOOGLE_CLIENT_ID="...apps.googleusercontent.com"
export GOOGLE_CLIENT_SECRET="..."
export AUTH_SESSION_SECRET="$(openssl rand -base64 48)"
export DISCLOSURE_RATE_LIMIT_HMAC_SECRET="$(openssl rand -base64 48)"
export GOOGLE_ALLOWED_EMAILS="owner@example.com"

./deploy/google-cloud/deploy-cloud-run.sh
```

The script prints the Cloud Run HTTPS URL. Set the OAuth callback to:

```text
https://SERVICE-URL/api/auth/google/callback
```

Then update the service with the callback URL:

```bash
gcloud run services update innovator \
  --region="$REGION" \
  --update-env-vars="GOOGLE_REDIRECT_URI=https://SERVICE-URL/api/auth/google/callback"
```

Use a pinned Secret Manager version for production rotation. The script uses `latest` for convenient trials; Google recommends pinning versions for environment-variable secrets.

## Verification

```bash
SERVICE_URL="$(gcloud run services describe innovator --region="$REGION" --format='value(status.url)')"
curl -fsS "$SERVICE_URL/healthz"
curl -fsS "$SERVICE_URL/api/session"
```

Then verify the Google OAuth round trip, generate an invention with the Hugging Face provider, inspect the provenance label, and confirm that private workspace creation is limited to the configured Google identity. Review Cloud Run logs with:

```bash
gcloud run services logs read innovator --region="$REGION" --limit=100
```

## Durable production path

For durable saved workspaces without a storage-adapter migration, deploy the container with Docker Compose on one Compute Engine VM with a persistent disk. Keep a single app instance and back up the Docker volumes. For scalable Cloud Run production, replace the D1/R2-compatible layer with Cloud SQL or another managed transactional database plus Cloud Storage for project documents, then add migrations, backup, restore, and concurrency tests.

## Source references

- [Cloud Run container runtime contract](https://docs.cloud.google.com/run/docs/container-contract)
- [Cloud Run secrets](https://docs.cloud.google.com/run/docs/configuring/services/secrets)
- [Cloud Run deploy from source](https://docs.cloud.google.com/run/docs/deploying-source-code)
- [Artifact Registry](https://cloud.google.com/artifact-registry/docs)
