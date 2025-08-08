# GitHub repositories monitoring

### Features:
 - Sign In / Sign Up
 - Add github repository
 - Refetch info from github repository
 - Remove github repository

## Production Setup

### Prerequisites

- [Docker](https://www.docker.com/) and Docker Compose

### Just run:
```sh
docker-compose up -d
```

*Thats all.*

## Development Setup

### Prerequisites

- [Docker](https://www.docker.com/) and Docker Compose
- [Node.js 20+](https://nodejs.org/) 
- [pnpm 10+](https://pnpm.io/) for package management 

### Database Setup

1. Start the PostgreSQL database using Docker Compose:

```sh
 docker compose -f docker-compose.dev.yaml up -d
```

2. The database will be available at `localhost:5555` with the following credentials:
   - Database: `app`
   - Username: `postgres`
   - Password: `postgres`

### Backend (API) Setup

1. Install dependencies at the repo root:

```sh
pnpm install
```

2. Create an `.env` file in `apps/api` with the following content (adjust as needed):

```env
PORT=1234
DATABASE_HOST=localhost
DATABASE_PORT=5555
DATABASE_USERNAME=postgres
DATABASE_PASSWORD=postgres
DATABASE_NAME=app
# Optional: personal token to increase GitHub API rate limits
# GITHUB_TOKEN=
# Optional: provide keys via env instead of files
# JWT_PUBLIC_KEY=
# JWT_SECRET_KEY=
```

3. Generate JWT keys (skippable if you set `JWT_PUBLIC_KEY`/`JWT_SECRET_KEY` in the env file):

```sh
pnpm -C apps/api run generate:jwt-keys
```

4. Run database migrations:

```sh
pnpm -C apps/api run migration:run
```

5. Start the API (listens on `http://localhost:1234`):

```sh
pnpm -C apps/api dev
```

### Frontend (Web) Setup

1. Start the Vite dev server (default `http://localhost:5173`):

```sh
pnpm -C apps/web dev
```

The web app proxies `/api` requests to `http://localhost:1234` (see `apps/web/vite.config.ts`). Ensure the API runs on port `1234`.

### Run both apps together

You can also start both API and Web from the repo root (after setting up the DB and `apps/api/.env`):

```sh
pnpm dev
```
