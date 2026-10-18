# Innovator uses the Cloudflare Vite/Workerd preview runtime, so keep the
# development dependencies required by pnpm start in the runtime image.
FROM node:22-bookworm-slim

WORKDIR /app

ENV PNPM_HOME="/pnpm"
ENV PATH="${PNPM_HOME}:${PATH}"

RUN corepack enable \
    && corepack prepare pnpm@10.8.1 --activate

# Copy lockfile first to maximize dependency-layer cache reuse.
COPY package.json pnpm-lock.yaml ./
RUN pnpm install --frozen-lockfile --prod=false

COPY . .
RUN pnpm build

ENV NODE_ENV="production" \
    HOST="0.0.0.0" \
    PORT="3000" \
    WRANGLER_WRITE_LOGS="false" \
    WRANGLER_SEND_METRICS="false" \
    WRANGLER_LOG_PATH="/app/.wrangler/logs" \
    MINIFLARE_REGISTRY_PATH="/app/.wrangler/registry"

EXPOSE 3000

HEALTHCHECK --interval=30s --timeout=5s --start-period=60s --retries=5 \
  CMD node -e "fetch('http://127.0.0.1:3000/').then((r) => process.exit(r.ok ? 0 : 1)).catch(() => process.exit(1))"

CMD ["pnpm", "start"]
