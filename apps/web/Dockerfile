FROM oven/bun:1 as base

FROM base AS builder
WORKDIR /app
RUN bun install -g turbo
COPY . .
# Prune the workspace to only what web needs
RUN turbo prune web --docker

FROM base AS installer
WORKDIR /app
# First install the dependencies (as they change less often)
COPY --from=builder /app/out/json/ .
RUN bun install

# Copy source code of isolated subworkspace
COPY --from=builder /app/out/full/ .
RUN turbo run build --filter=web

FROM nginx:alpine as runner
WORKDIR /usr/share/nginx/html

# Clean default nginx html
RUN rm -rf ./*

# Copy built assets from installer
COPY --from=installer /app/apps/web/dist .

# Copy custom nginx config if needed for client-side routing
# For standard SPA navigation fallback
RUN echo 'server { \
    listen 80; \
    location / { \
        root /usr/share/nginx/html; \
        index index.html index.htm; \
        try_files $uri $uri/ /index.html; \
    } \
}' > /etc/nginx/conf.d/default.conf

EXPOSE 80

CMD ["nginx", "-g", "daemon off;"]
