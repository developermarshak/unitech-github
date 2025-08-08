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

# run migrations
node ./dist/scripts/migrate.js

exec node ./dist/server.js
