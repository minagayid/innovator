# Portable OCI image for Cloud Run, AWS container services, Oracle OCI, OVHcloud and Docker hosts.
# Vercel uses Dockerfile.vercel because its container port defaults differ.
FROM node:22-bookworm-slim

WORKDIR /app
RUN npm install --global pnpm@10.8.1 \
    && pnpm --version

COPY package.json pnpm-lock.yaml ./
RUN pnpm install --frozen-lockfile --prod=false

# The production preview uses the Workerd-compatible Vite runtime. Research/archive
# content is intentionally excluded by .dockerignore; runtime code must not import it.
COPY . .
RUN pnpm build \
    && mkdir -p /app/.wrangler/logs /app/.wrangler/registry /app/.wrangler/state \
    && chown -R node:node /app

ENV NODE_ENV="production" \
    HOST="0.0.0.0" \
    PORT="8080" \
    WRANGLER_WRITE_LOGS="false" \
    WRANGLER_SEND_METRICS="false" \
    WRANGLER_LOG_PATH="/app/.wrangler/logs" \
    MINIFLARE_REGISTRY_PATH="/app/.wrangler/registry"

USER node
EXPOSE 8080

HEALTHCHECK --interval=30s --timeout=5s --start-period=60s --retries=5 \
  CMD node -e "fetch('http://127.0.0.1:'+(process.env.PORT||'8080')+'/').then((r) => process.exit(r.ok ? 0 : 1)).catch(() => process.exit(1))"

CMD ["pnpm", "start"]
