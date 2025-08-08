#!/bin/sh
set -eu

KEYS_DIR=".keys"
PRIVATE_KEY_PATH="$KEYS_DIR/jwtRS256.key"
PUBLIC_KEY_PATH="$KEYS_DIR/jwtRS256.key.pub"

# Generate RSA keys if env vars not provided and files do not exist
if [ -z "${JWT_PUBLIC_KEY:-}" ] || [ -z "${JWT_SECRET_KEY:-}" ]; then
  mkdir -p "$KEYS_DIR"
  if [ ! -f "$PRIVATE_KEY_PATH" ] || [ ! -f "$PUBLIC_KEY_PATH" ]; then
    echo "[api] Generating RSA key pair..."
    openssl genrsa -out "$PRIVATE_KEY_PATH" 2048 >/dev/null 2>&1
    openssl rsa -in "$PRIVATE_KEY_PATH" -pubout -out "$PUBLIC_KEY_PATH" >/dev/null 2>&1
  fi
fi

# Wait for PostgreSQL to be ready before proceeding
if [ -n "${DATABASE_HOST:-}" ] && [ -n "${DATABASE_PORT:-}" ]; then
  echo "[api] Waiting for PostgreSQL at ${DATABASE_HOST}:${DATABASE_PORT}..."
  for i in $(seq 1 60); do
    if pg_isready -h "$DATABASE_HOST" -p "$DATABASE_PORT" >/dev/null 2>&1; then
      echo "[api] PostgreSQL is ready."
      break
    fi
    if [ "$i" -eq 60 ]; then
      echo "[api] PostgreSQL did not become ready in time." >&2
      exit 1
    fi
    sleep 1
  done
fi

# run migrations
node ./dist/scripts/migrate.js

exec node ./dist/server.js
