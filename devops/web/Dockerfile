ARG NODE_VERSION=24

FROM node:${NODE_VERSION}-alpine AS builder
WORKDIR /build

RUN corepack enable && corepack prepare pnpm@10.14.0 --activate

COPY pnpm-workspace.yaml pnpm-lock.yaml package.json turbo.json .npmrc ./
COPY apps/web/package.json apps/web/tsconfig.json ./apps/web/
COPY packages/api-client/package.json ./packages/api-client/package.json
COPY packages/contracts/package.json ./packages/contracts/package.json
COPY packages/typescript-config/package.json ./packages/typescript-config/package.json
COPY packages/eslint-config/package.json ./packages/eslint-config/package.json

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
