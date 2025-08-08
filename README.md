# `Turborepo` Vite starter

This is a community-maintained example. If you experience a problem, please submit a pull request with a fix. GitHub Issues will be closed.

## Using this example

Run the following command:

```sh
npx create-turbo@latest -e with-vite-react
```

## What's inside?

This Turborepo includes the following packages and apps:

### Apps and Packages

- `web`: react [vite](https://vitejs.dev) ts app
- `@repo/ui`: a stub component library shared by `web` application
- `@repo/eslint-config`: shared `eslint` configurations
- `@repo/typescript-config`: `tsconfig.json`s used throughout the monorepo

Each package and app is 100% [TypeScript](https://www.typescriptlang.org/).

## Development Setup

### Prerequisites

- [Docker](https://www.docker.com/) and Docker Compose
- [pnpm](https://pnpm.io/) for package management

### Database Setup

1. Start the PostgreSQL database using Docker Compose:

```sh
docker-compose up -d
```

2. The database will be available at `localhost:5432` with the following credentials:
   - Database: `unitech_dev`
   - Username: `postgres`
   - Password: `postgres`

3. For the API to connect to the database, ensure your environment has:

```
DATABASE_URL="postgresql://postgres:postgres@localhost:5432/unitech_dev?schema=public"
```

4. To stop the database:

```sh
docker-compose down
```

5. To remove the database data (fresh start):

```sh
docker-compose down -v
```

### Utilities

This Turborepo has some additional tools already setup for you:

- [TypeScript](https://www.typescriptlang.org/) for static type checking
- [ESLint](https://eslint.org/) for code linting
- [Prettier](https://prettier.io) for code formatting
