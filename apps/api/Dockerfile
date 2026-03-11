FROM oven/bun:1 as base

FROM base AS builder
# Set working directory
WORKDIR /app
RUN bun install -g turbo
COPY . .
# Prune the workspace to only what api needs
RUN turbo prune api --docker

FROM base AS installer
WORKDIR /app
RUN bun install -g turbo
# Install dependencies using the pruned lockfile
# First install the dependencies (as they change less often)
COPY --from=builder /app/out/json/ .
RUN bun install

# Build the project
COPY --from=builder /app/out/full/ .
RUN bun build --minify-whitespace --minify-syntax --target bun --outfile server.js apps/api/src/index.ts

FROM base AS runner
WORKDIR /app

# Don't run production as root
RUN addgroup --system --gid 1001 bunuser \
  && adduser --system --uid 1001 --ingroup bunuser bunuser
USER bunuser

COPY --from=installer /app .

ENV NODE_ENV=production
ENV PORT=4000

EXPOSE 4000

CMD ["bun", "run", "server.js"]
