# Workerd preview requires the Vite/Cloudflare dependencies at runtime.
FROM node:22-bookworm-slim

WORKDIR /app
ENV PNPM_HOME="/pnpm"
ENV PATH="${PNPM_HOME}:${PATH}"

RUN corepack enable \
    && corepack prepare pnpm@10.8.1 --activate

COPY package.json pnpm-lock.yaml ./
RUN pnpm install --frozen-lockfile --prod=false

# .dockerignore excludes the old invention archive and non-runtime research assets.
COPY . .
RUN pnpm build

# Cloud Run sets PORT (8080 by default); Compose overrides it to 3000 locally.
ENV NODE_ENV="production" \
    HOST="0.0.0.0" \
    PORT="8080" \
    WRANGLER_WRITE_LOGS="false" \
    WRANGLER_SEND_METRICS="false" \
    WRANGLER_LOG_PATH="/app/.wrangler/logs" \
    MINIFLARE_REGISTRY_PATH="/app/.wrangler/registry"

EXPOSE 8080

HEALTHCHECK --interval=30s --timeout=5s --start-period=60s --retries=5 \
  CMD node -e "fetch('http://127.0.0.1:'+(process.env.PORT||'8080')+'/').then((r) => process.exit(r.ok ? 0 : 1)).catch(() => process.exit(1))"

CMD ["pnpm", "start"]
