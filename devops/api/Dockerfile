ARG NODE_VERSION=24

FROM node:${NODE_VERSION}-alpine AS builder
WORKDIR /build

# Enable pnpm via Corepack
RUN corepack enable && corepack prepare pnpm@10.14.0 --activate

# Only copy minimal files first for better caching
COPY pnpm-workspace.yaml pnpm-lock.yaml package.json turbo.json ./
COPY apps/api/package.json apps/api/tsconfig.json ./apps/api/
COPY packages/typescript-config/package.json ./packages/typescript-config/package.json

RUN pnpm --filter api install --frozen-lockfile

# Copy sources and shared tsconfig and contracts src for path mapping
COPY apps/api/src ./apps/api/src
COPY packages/typescript-config ./packages/typescript-config
COPY packages/contracts ./packages/contracts

RUN pnpm --filter api build


FROM node:${NODE_VERSION}-alpine AS runtime

WORKDIR /app

# Runtime needs openssl to generate RSA keys at startup
RUN apk add --no-cache openssl

# Copy only runtime artifacts
COPY --from=builder /build/apps/api/dist ./dist
COPY apps/api/package.json ./package.json

ENV NODE_ENV=production
ENV PORT=3001

# Entrypoint will generate RSA keys if missing, then start server
COPY devops/api/entrypoint.sh /entrypoint.sh
RUN chmod +x /entrypoint.sh

EXPOSE 3001
ENTRYPOINT ["/entrypoint.sh"]
