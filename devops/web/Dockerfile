ARG NODE_VERSION=24

FROM node:${NODE_VERSION}-alpine AS builder
WORKDIR /build

RUN corepack enable && corepack prepare pnpm@10.14.0 --activate

# Only copy minimal files first for better caching
COPY ./package.json ./pnpm-lock.yaml ./turbo.json ./pnpm-workspace.yaml .npmrc ./
COPY ./apps/web/package.json ./apps/web/tsconfig.json ./apps/web/
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

# Copy web to build
COPY ./apps/web/src ./apps/web/src
COPY ./apps/web/vite.config.ts ./apps/web/vite.config.ts
COPY ./apps/web/index.html ./apps/web/index.html
COPY ./apps/web/public ./apps/web/public

RUN pnpm run build:web

# Install deps for web and its local packages
RUN pnpm --filter web install --frozen-lockfile

COPY apps/web ./apps/web
COPY packages/api-client ./packages/api-client
COPY packages/contracts ./packages/contracts
COPY packages/typescript-config ./packages/typescript-config
COPY packages/eslint-config ./packages/eslint-config

RUN pnpm --filter web build


FROM nginx:1.27-alpine AS runtime

COPY --from=builder /build/apps/web/dist /usr/share/nginx/html
COPY devops/nginx/nginx.conf /etc/nginx/nginx.conf

EXPOSE 80
CMD ["nginx", "-g", "daemon off;"]
