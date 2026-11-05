#!/bin/sh
# Run db migrations inside the compose network, using the api image.
# Starts db if needed. Usage: sudo ./migrate.sh
set -e
cd "$(dirname "$0")"
exec docker compose run --rm -w /app/packages/db -e PG_MIGRATE_HOST=db api bun src/migrate.ts
