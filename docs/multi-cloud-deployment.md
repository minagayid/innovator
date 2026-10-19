# Multi-cloud container deployment for Innovator

Innovator's root Dockerfile builds the portable OCI image for Docker-compatible services. Dockerfile.vercel is the Vercel container entrypoint and defaults to HTTP port 80. Both images use the same app start script and honor the runtime-provided PORT.

## Build and smoke-test locally

~~~sh
pnpm install --frozen-lockfile
pnpm test
pnpm lint
docker build -t innovator:local .
docker run --rm --init -p 8080:8080 --env-file .env -e PORT=8080 innovator:local
~~~

Set environment secrets outside the image. For a minimal HTTP test without provider credentials, run the container with PORT=8080 and request /. Google OAuth and model-assisted generation require their corresponding environment settings.

## Provider guide

| Platform | Container entrypoint | Important note |
|---|---|---|
| Google Cloud Run | Root Dockerfile | Cloud Run injects PORT; do not set it via --set-env-vars. Use Cloud Build to build/push or deploy the built image. |
| AWS ECS/Fargate or App Runner | Root Dockerfile | Publish the image to a reachable registry, set PORT=8080 if the platform does not supply it, and configure secrets/health checks in the service definition. |
| Oracle Cloud Container Instances | Root Dockerfile | Push an OCI image to OCIR or another reachable registry and configure the container's listener port and environment. |
| OVHcloud VM / Managed Kubernetes | Root Dockerfile | Use Docker Compose on a VM, or deploy the image through Kubernetes manifests with the needed persistent storage. |
| Vercel Container Functions | Dockerfile.vercel | Vercel recognizes this filename and runs the HTTP server as a container function. Functions are stateless; do not rely on local container state for saved workspaces. |

Build a portable image once and push it to a registry the target platform can read, then configure environment variables, secret bindings, ingress, TLS and health probes in that platform. The same Dockerfile does not automatically provision a managed database, bucket, IAM permissions, network or DNS.

## Local state and what is not portable yet

The application directly uses Cloudflare D1/R2 APIs through cloudflare:workers bindings supplied by the Cloudflare Vite plugin. In non-Cloudflare containers, these are provided by the local Wrangler/Miniflare runtime. That is suitable for a single long-lived preview instance, not durable shared storage for auto-scaling or stateless containers.

- On a VM, use the existing compose.yaml volumes and run a single instance until state has been migrated; configure disk backups and test restores.
- On Cloud Run, Vercel, App Runner or other ephemeral/serverless instances, saved users/projects/quotas can disappear or diverge between instances.
- Do not treat a successful image build or HTTP health check as proof that saved workspace data is durable.
- For production multi-instance use, replace the D1/R2 emulation dependency with an explicit managed database and object-storage adapter (and migrations/backups) supported by the target cloud.

## Google Cloud Run example

Build and push using the repository Cloud Build config:

~~~sh
gcloud builds submit --region=us-central1 --config=cloudbuild.yaml .
~~~

Then deploy an immutable image tag. The example below intentionally leaves PORT out of --set-env-vars; Cloud Run supplies it to the ingress container:

~~~sh
gcloud run deploy innovator \
  --image=us-central1-docker.pkg.dev/PROJECT_ID/innovator/innovator:BUILD_ID \
  --region=us-central1 --port=8080 \
  --set-env-vars=NODE_ENV=production,HOST=0.0.0.0,AUTH_TRUST_CHATGPT_HEADERS=false
~~~

Configure Google OAuth callback URLs and secrets using Secret Manager; see google-cloud-deployment.md.

## Vercel

Connect the repository to Vercel and let it detect Dockerfile.vercel, or run vercel deploy with the Vercel CLI. Configure the required environment variables in the Vercel project settings. Vercel container functions do not provide Docker Compose named volumes, so use this target for preview/generation-only unless the storage layer has been moved to durable managed services.

Official references: [Cloud Run container contract](https://docs.cloud.google.com/run/docs/container-contract), [AWS App Runner image deployments](https://docs.aws.amazon.com/apprunner/latest/dg/service-source-image.html), [Oracle Container Instances](https://docs.oracle.com/en-us/iaas/Content/container-instances/overview-of-container-instances.htm), [OVHcloud Managed Kubernetes](https://docs.ovhcloud.com/en/guides/public-cloud/containers-orchestration/managed-kubernetes/understanding-mks-architecture), [Vercel container images](https://vercel.com/kb/guide/docker).
