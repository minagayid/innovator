# Google Cloud deployment guide

## Important architecture decision

The current database layer uses Cloudflare D1/R2 interfaces backed by Wrangler/Miniflare local emulation. The container can build and start on Google Cloud, but this emulated storage is **not a durable Cloud Run database**. Cloud Run's writable filesystem disappears when an instance stops; a Cloud Storage FUSE mount does not supply ordinary file-locking semantics. Use Cloud Run only for an ephemeral preview of generation, or migrate D1/R2 to managed Google Cloud database/object-storage adapters before treating this as a durable multi-user SaaS.

For durable saved workspaces without a storage-adapter migration, use a **single Compute Engine VM with a persistent disk** and Docker Compose named volumes. Do not scale local SQLite/Miniflare state across replicas.

## 1. Build and push with Cloud Build

Enable the services and create an Artifact Registry Docker repository (once):

```sh
gcloud config set project YOUR_PROJECT_ID
gcloud services enable artifactregistry.googleapis.com cloudbuild.googleapis.com
gcloud artifacts repositories create innovator --repository-format=docker --location=us-central1
```

Grant the Cloud Build service account Artifact Registry Writer access for that repository, then submit the build:

```sh
gcloud builds submit --region=us-central1 --config=cloudbuild.yaml .
```

The build pushes an immutable image tagged with the Cloud Build ID to `us-central1-docker.pkg.dev/PROJECT_ID/innovator/innovator:BUILD_ID`. It does not silently deploy or make the service public.

## 2. Configure Google sign-in

In Google Cloud Console, create an OAuth client for a Web application. Add the exact redirect URI `https://YOUR_PUBLIC_HOST/api/auth/google/callback` (or the Cloud Run URL after the first bootstrap deploy). Store the client ID and client secret in Secret Manager. Also create `AUTH_SESSION_SECRET` and `DISCLOSURE_RATE_LIMIT_HMAC_SECRET` values with at least 32 random characters each. Never put these values in Dockerfile `ENV`, the image, or source control.

Optional: set `GOOGLE_ALLOWED_EMAILS` to a comma-separated list of permitted addresses for private testing. If omitted, any Google account that returns a verified email may sign in. The session cookie is HTTP-only, Secure on HTTPS, SameSite=Lax, HMAC-signed, and expires after seven days. OAuth uses state validation and PKCE.

ChatGPT identity headers are not assumed to exist. `AUTH_TRUST_CHATGPT_HEADERS` defaults to `false`; only enable it if a separately authenticated ingress prevents clients forging those headers.

## 3. Recommended durable path: Compute Engine + Docker Compose

Create a Debian or Ubuntu Compute Engine VM with a persistent boot disk (or attach a separate persistent disk), then install Docker Engine and the Docker Compose plugin. Configure firewall rules to allow only intended public ingress; HTTPS through a load balancer or reverse proxy is recommended.

On the VM, clone the repository, create `.env` from `.env.example`, and set:

- `PORT=8080` (host port; Compose maps it to container port 3000)
- `GOOGLE_CLIENT_ID`, `GOOGLE_CLIENT_SECRET`, and `GOOGLE_REDIRECT_URI=https://YOUR_PUBLIC_HOST/api/auth/google/callback`
- `AUTH_SESSION_SECRET` and `DISCLOSURE_RATE_LIMIT_HMAC_SECRET`
- `GOOGLE_ALLOWED_EMAILS` for a restricted deployment
- `OPENAI_API_KEY` or `GEMINI_API_KEY` only when model-assisted generation is wanted

Then run:

```sh
docker compose -f compose.yaml up --build -d
docker compose -f compose.yaml ps
docker compose -f compose.yaml logs --tail=200 innovator
```

The named Docker volumes are stored on the VM's Docker data disk. Verify that the disk survives VM restart and replacement, configure backups, and rehearse a restore before saving valuable work. Keep a single app instance with the current local D1/R2 emulation.

## 4. Optional Cloud Run preview

Cloud Run uses port 8080 by default; this image and launcher honor its injected `PORT`. First deploy the built image, then copy its HTTPS service URL and register that URL as the OAuth callback origin. Re-deploy/update with the final callback URI.

Example after creating Secret Manager entries named `google-client-id`, `google-client-secret`, `innovator-session-secret`, and `innovator-rate-secret`:

```sh
gcloud run deploy innovator \
  --image=us-central1-docker.pkg.dev/YOUR_PROJECT_ID/innovator/innovator:BUILD_ID \
  --region=us-central1 --port=8080 --cpu=2 --memory=2Gi \
  --set-env-vars=NODE_ENV=production,HOST=0.0.0.0,PORT=8080,AUTH_TRUST_CHATGPT_HEADERS=false \
  --set-secrets=GOOGLE_CLIENT_ID=google-client-id:latest,GOOGLE_CLIENT_SECRET=google-client-secret:latest,AUTH_SESSION_SECRET=innovator-session-secret:latest,DISCLOSURE_RATE_LIMIT_HMAC_SECRET=innovator-rate-secret:latest \
  --allow-unauthenticated
```

After the first deployment, set `GOOGLE_REDIRECT_URI` to `https://YOUR_CLOUD_RUN_SERVICE_URL/api/auth/google/callback` and register the same URI in the OAuth client:

```sh
gcloud run services update innovator --region=us-central1 --update-env-vars=GOOGLE_REDIRECT_URI=https://YOUR_CLOUD_RUN_SERVICE_URL/api/auth/google/callback
```

`--allow-unauthenticated` lets Cloud Run receive public HTTP traffic; it does not bypass app sign-in checks for creating or reading private workspaces. Restrict accounts with `GOOGLE_ALLOWED_EMAILS` when appropriate.

**Do not treat this Cloud Run configuration as durable storage.** User/project tables, quotas, and project documents still use local Wrangler/Miniflare state. Use the Compute Engine path above for persistent data, or complete a managed database/object-storage adapter migration before public production use.

## 5. Smoke-check and rollback

Before launch, run `pnpm install --frozen-lockfile`, `pnpm test`, and `pnpm lint`; build the container; open `/`; verify Google OAuth round-trip and allowlist rejection; generate a candidate with a test provider key; save a private workspace; restart the VM; confirm the workspace still exists; and test restore from backup. Record the image tag and previous tag so rollback is a one-command image redeploy.

Docker Engine and a Google Cloud project are not available in this editing environment. The repository checks here are source-level; they are not evidence that a remote image build or live OAuth flow has completed.
