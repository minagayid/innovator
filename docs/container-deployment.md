# Docker deployment for Innovator

This package runs the Innovator Vinext application in its Cloudflare-compatible Workerd preview runtime inside a Docker container.

## Quick start

Requirements: Docker Engine and Docker Compose v2.

```bash
cp .env.example .env
# Edit .env only if you want optional model-backed disclosure generation.
docker compose -f compose.yaml up --build -d
docker compose -f compose.yaml ps
docker compose -f compose.yaml logs -f innovator
```

Open `http://localhost:3000`. To use another host port, set `PORT=8080` in `.env`; then open `http://localhost:8080`. The application still listens on port 3000 inside the container.

To stop the app without deleting persisted state:

```bash
docker compose -f compose.yaml down
```

To delete the app and all local persisted data (destructive):

```bash
docker compose -f compose.yaml down -v
```

## Configure provider keys

`OPENAI_API_KEY` and `GEMINI_API_KEY` are optional. Without a provider key, the app uses its deterministic fallback path. If both keys are configured, the current app prefers Gemini. Keep real credentials in a local ignored `.env` file or in your cloud provider's secret/environment-variable store; never commit them.

The current paid-inference quota gate explicitly requires a trusted Cloudflare edge IP (`CF-Connecting-IP`) and an HMAC secret. A non-Cloudflare hosting setup should not set `DISCLOSURE_TRUST_CF_EDGE=true` unless traffic is guaranteed to pass through a trusted Cloudflare proxy and direct access to the container is blocked. Do not fabricate the header in a public request path. Until an appropriate trusted caller-identity adapter is implemented, paid provider calls may safely fall back rather than run.

## Important storage and multi-cloud boundary

The app imports `cloudflare:workers` and its data layer requires Cloudflare-compatible `DB` (D1) and `PROJECTS` (R2) bindings. This Compose setup uses the local Wrangler/Miniflare emulation of those bindings and persists its state in named Docker volumes under `/app/.wrangler/`.

This makes the same container deployable on a Docker-compatible VM or container service **for a single instance with durable storage**. It does **not** convert D1/R2 into provider-neutral managed database and object storage services. Before running multiple replicas, using ephemeral-disk serverless containers, or treating this as a high-availability production deployment, replace or abstract those bindings behind provider-neutral adapters (for example, a managed SQL database and S3-compatible object storage), then run the app's full test suite against those adapters. Do not mount the same local Wrangler state to multiple replicas as a substitute for a distributed database.

For the current storage model:

- Keep the named volumes `innovator_state`, `innovator_registry`, and `innovator_logs` on persistent disk.
- Confirm that the target platform preserves those volumes across restarts and redeployments.
- Run one application replica per independent local state volume.
- Back up persistent state and test restore before handling important user data.

For a native Cloudflare deployment, continue using the repository's Worker-compatible deployment approach with real D1/R2 bindings instead of this local-container persistence model.

## Operations

- The image runs `pnpm build` during image creation and starts using the repository's `pnpm start` script, which launches Vite preview through Workerd.
- The container exposes port `3000`; TLS termination and public-domain routing should be configured in the cloud load balancer or ingress.
- A built-in health check sends an HTTP request to `/`.
- Build in CI and deploy an immutable image digest for repeatability. Keep secrets in the runtime environment, not in image layers or Compose source.

## What has and has not been verified

This configuration is based on the repository's existing `package.json`, `vite.config.ts`, `scripts/start.mjs`, and Cloudflare D1/R2 binding design. The Compose configuration has not been tested by a local Docker engine in this workflow. Run a Docker build, Workerd startup, persistent-data restart test, and target cloud-provider smoke test before treating the deployment as validated.
