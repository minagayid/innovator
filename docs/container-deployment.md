# Docker deployment for Innovator

Innovator builds a generator-first web application and runs its production bundle through the Cloudflare-compatible Workerd preview runtime. The image defaults to Google Cloud Run's port contract (`8080`); Docker Compose overrides the internal port to `3000` for local development.

## Local Docker Compose

Requirements: Docker Engine and Docker Compose v2.

```sh
cp .env.example .env
# Configure Google OAuth and, optionally, a model provider in .env.
docker compose -f compose.yaml up --build -d
docker compose -f compose.yaml ps
docker compose -f compose.yaml logs -f innovator
```

Open `http://localhost:3000`. To expose another host port, set `PORT=8080` in `.env`; the application still listens on `3000` inside Compose.

To stop without removing saved local state, run `docker compose -f compose.yaml down`. Do not use `down -v` unless you intend to remove the named state volumes.

## Build and run a container

```sh
docker build -t innovator:local .
docker run --rm -p 8080:8080 --env PORT=8080 innovator:local
```

The server binds to `0.0.0.0` and respects the `PORT` environment variable. The Docker health check probes that same port, rather than hard-coding `3000`.

## Google OAuth and provider settings

Configure `GOOGLE_CLIENT_ID`, `GOOGLE_CLIENT_SECRET`, `GOOGLE_REDIRECT_URI`, and `AUTH_SESSION_SECRET` (at least 32 characters). The redirect URI must exactly match the callback registered in Google Cloud Console: `/api/auth/google/callback`. Set `GOOGLE_ALLOWED_EMAILS` to a comma-separated allowlist for a restricted/private deployment; an empty allowlist permits any Google account with a verified email.

Set `DISCLOSURE_RATE_LIMIT_HMAC_SECRET` to a random secret of at least 32 characters. Authenticated Google users are hashed before their per-user quota is recorded. `AUTH_TRUST_CHATGPT_HEADERS` is `false` by default; enable it only behind an ingress that authenticates the user and strips caller-supplied copies of ChatGPT identity headers.

`OPENAI_API_KEY` and `GEMINI_API_KEY` are optional. Gemini takes precedence when configured; the application makes at most one paid-provider request per generation and returns an explicitly labeled deterministic scaffold when a provider key, trusted identity, or quota is unavailable. Put secrets in environment variables or Secret Manager, never in the image or source control.

## Keep the invention archive out of the image

Existing research packages and example UI source remain tracked in `archive/`, `inventions/`, `related-projects/`, and the repository's asset folders. `.dockerignore` excludes these paths from the Docker build context. The production page has no preloaded invention gallery or bundled prior-art examples: each candidate starts from the current user's specification. The source archive is not deleted.

## Storage boundary: do not confuse startup with durable persistence

The application uses Cloudflare-compatible D1 and R2 interfaces through local Wrangler/Miniflare emulation. Named Compose volumes keep that state across container recreation on the same Docker host. They do not create provider-neutral managed storage.

Google Cloud Run's writable container filesystem is ephemeral and is lost when an instance stops. Do not use local D1/R2 emulation as durable workspace storage on Cloud Run. Do not mount Miniflare/SQLite state onto Cloud Storage FUSE as a substitute for a transactional disk. Use the deployment guide's single-VM Compute Engine path with a persistent disk for saved workspaces, or migrate the storage layer to managed GCP database/object-storage adapters before scaling on Cloud Run.

## What is verified

Repository tests include source-level checks for the Docker port contract, archive exclusions, OAuth session signing, and redirect-path safety. A Docker engine and Google Cloud project are not available in this editing workflow, so an actual image build, live OAuth round-trip, and cloud smoke test still need to be run in your environment.
