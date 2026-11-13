#!/usr/bin/env bash
set -euo pipefail

# Usage:
#   PROJECT_ID=my-project REGION=us-central1 \
#   HF_TOKEN=hf_... GOOGLE_CLIENT_ID=... GOOGLE_CLIENT_SECRET=... \
#   ./deploy/google-cloud/deploy-cloud-run.sh
#
# The script never writes secret values to the image or Git. It creates/updates
# Secret Manager versions from environment variables, then references pinned
# versions from Cloud Run.

: "${PROJECT_ID:?Set PROJECT_ID to the Google Cloud project ID}"
REGION="${REGION:-us-central1}"
SERVICE="${SERVICE:-innovator}"
REPOSITORY="${REPOSITORY:-innovator}"
IMAGE="${REGION}-docker.pkg.dev/${PROJECT_ID}/${REPOSITORY}/${SERVICE}:${BUILD_ID:-$(date -u +%Y%m%d%H%M%S)}"
RUNTIME_SERVICE_ACCOUNT="${RUNTIME_SERVICE_ACCOUNT:-${SERVICE}-run@${PROJECT_ID}.iam.gserviceaccount.com}"

command -v gcloud >/dev/null || { echo "gcloud CLI is required." >&2; exit 1; }

gcloud config set project "${PROJECT_ID}" >/dev/null
gcloud services enable run.googleapis.com artifactregistry.googleapis.com cloudbuild.googleapis.com secretmanager.googleapis.com iam.googleapis.com

gcloud artifacts repositories describe "${REPOSITORY}" --location "${REGION}" >/dev/null 2>&1 || \
  gcloud artifacts repositories create "${REPOSITORY}" --repository-format=docker --location="${REGION}" --description="Innovator container images"

gcloud iam service-accounts describe "${RUNTIME_SERVICE_ACCOUNT}" >/dev/null 2>&1 || \
  gcloud iam service-accounts create "${SERVICE}-run" --display-name="Innovator Cloud Run runtime"

gcloud projects add-iam-policy-binding "${PROJECT_ID}" \
  --member="serviceAccount:${RUNTIME_SERVICE_ACCOUNT}" \
  --role="roles/logging.logWriter" --quiet >/dev/null

put_secret() {
  local name="$1" value="${2:-}"
  if [[ -z "${value}" ]]; then
    echo "Skipping empty secret ${name}; configure it in Secret Manager before relying on it." >&2
    return 0
  fi
  if gcloud secrets describe "${name}" >/dev/null 2>&1; then
    printf '%s' "${value}" | gcloud secrets versions add "${name}" --data-file=- >/dev/null
  else
    printf '%s' "${value}" | gcloud secrets create "${name}" --data-file=- --replication-policy=automatic >/dev/null
  fi
  gcloud secrets add-iam-policy-binding "${name}" \
    --member="serviceAccount:${RUNTIME_SERVICE_ACCOUNT}" \
    --role="roles/secretmanager.secretAccessor" --quiet >/dev/null
}

put_secret hf-token "${HF_TOKEN:-}"
put_secret google-client-id "${GOOGLE_CLIENT_ID:-}"
put_secret google-client-secret "${GOOGLE_CLIENT_SECRET:-}"
put_secret innovator-session-secret "${AUTH_SESSION_SECRET:-}"
put_secret innovator-rate-secret "${DISCLOSURE_RATE_LIMIT_HMAC_SECRET:-}"

ENV_VARS="^|^NODE_ENV=production|HOST=0.0.0.0|HF_MODEL=${HF_MODEL:-Qwen/Qwen3-4B-Instruct-2507:fastest}|AUTH_TRUST_CHATGPT_HEADERS=false|GOOGLE_ALLOWED_EMAILS=${GOOGLE_ALLOWED_EMAILS:-}|GOOGLE_REDIRECT_URI=${GOOGLE_REDIRECT_URI:-}"

# Cloud Build reads only source and the Dockerfile; no secret is a build arg.
gcloud builds submit --region="${REGION}" --tag="${IMAGE}" .

# Deploy a public HTTPS edge. Application sign-in still controls private workspaces
# and paid/model-backed disclosure requests.
gcloud run deploy "${SERVICE}" \
  --image="${IMAGE}" \
  --region="${REGION}" \
  --platform=managed \
  --service-account="${RUNTIME_SERVICE_ACCOUNT}" \
  --port=8080 \
  --cpu=2 \
  --memory=2Gi \
  --timeout=300 \
  --concurrency=20 \
  --max-instances=3 \
  --min-instances=0 \
  --execution-environment=gen2 \
  --allow-unauthenticated \
  --set-env-vars="${ENV_VARS}" \
  --update-secrets="HF_TOKEN=hf-token:latest,GOOGLE_CLIENT_ID=google-client-id:latest,GOOGLE_CLIENT_SECRET=google-client-secret:latest,AUTH_SESSION_SECRET=innovator-session-secret:latest,DISCLOSURE_RATE_LIMIT_HMAC_SECRET=innovator-rate-secret:latest" \
  --startup-probe=httpGet.path=/healthz,httpGet.port=8080,initialDelaySeconds=5,timeoutSeconds=5,periodSeconds=10,failureThreshold=12

gcloud run services describe "${SERVICE}" --region="${REGION}" --format='value(status.url)'
