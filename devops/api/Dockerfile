ARG NODE_VERSION=24

FROM node:${NODE_VERSION}-alpine AS builder
WORKDIR /build

# Enable pnpm via Corepack
RUN corepack enable && corepack prepare pnpm@10.14.0 --activate

# Only copy minimal files first for better caching
COPY ./package.json ./pnpm-lock.yaml ./turbo.json ./pnpm-workspace.yaml .npmrc ./
COPY ./apps/api/package.json ./apps/api/tsconfig.json ./apps/api/
COPY ./packages/contracts/package.json ./packages/contracts/tsconfig.json ./packages/contracts/
COPY ./packages/api-client/package.json ./packages/api-client/tsconfig.json ./packages/api-client/
COPY ./packages/eslint-config/package.json ./packages/eslint-config/
COPY ./packages/typescript-config/package.json ./packages/typescript-config/

RUN pnpm install --frozen-lockfile

# Copy packages to build
COPY ./packages/contracts/src ./packages/contracts/src
COPY ./packages/api-client/src ./packages/api-client/src
COPY ./packages/eslint-config ./packages/eslint-config
COPY ./packages/typescript-config ./packages/typescript-config

RUN pnpm run build:contracts
RUN pnpm run build:api-client

# Copy api to build
COPY ./apps/api/src ./apps/api/src
RUN pnpm run build:api

RUN pnpm --filter api deploy --prod /app


FROM node:${NODE_VERSION}-alpine AS runtime

WORKDIR /app

# Runtime needs openssl to generate RSA keys at startup
# Also install postgresql-client for pg_isready to wait for DB readiness
RUN apk add --no-cache openssl postgresql-client

# Copy only runtime artifacts
COPY --from=builder /app ./

ENV NODE_ENV=production
ENV PORT=3001

# Entrypoint will generate RSA keys if missing, then start server
COPY devops/api/entrypoint.sh /entrypoint.sh
RUN chmod +x /entrypoint.sh

EXPOSE 3001
ENTRYPOINT ["/entrypoint.sh"]
