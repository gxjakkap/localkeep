FROM oven/bun:1 AS base

FROM base AS builder
# Set working directory
WORKDIR /app
RUN bun install -g turbo
COPY . .
# Prune the workspace to only what api needs
RUN turbo prune api --docker

FROM base AS installer
WORKDIR /app
# Install dependencies using the pruned lockfile
# First install the dependencies (as they change less often)
COPY --from=builder /app/out/json/ .
RUN bun install

# Bundle the server and the migration script so the runner needs no node_modules
COPY --from=builder /app/out/full/ .
RUN bun build --minify-whitespace --minify-syntax --target bun --outfile server.js apps/api/src/index.ts
RUN bun build --minify-whitespace --minify-syntax --target bun --outfile packages/db/migrate.js packages/db/src/migrate.ts

FROM oven/bun:1-alpine AS runner
WORKDIR /app

COPY --from=installer /app/server.js .
# Used by migrate.sh, which runs from /app/packages/db
COPY --from=installer /app/packages/db/migrate.js /app/packages/db/
COPY --from=installer /app/packages/db/drizzle /app/packages/db/drizzle

# Don't run production as root
USER 1001

ENV NODE_ENV=production
ENV PORT=4000

EXPOSE 4000

CMD ["bun", "server.js"]
