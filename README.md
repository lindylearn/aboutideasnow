# LindyLearn Project Template

This is a simple template for full-stack TypeScript projects. This repo includes:

-   `apps/api`: A Node.js server to run long-running backend tasks
-   `apps/web`: A SvelteKit web app (with Tailwind CSS for styling)
-   `packages/core`: Shared util functions and the Prisma Postgres database config

## Installation

-   Create `.env` files in `apps/api`, `apps/web`, and `packages/core` (look at the `.env.example` files)
-   `pnpm install` to install the dependencies

## Development

-   `pnpm dev` to run all apps
-   `cd packages/core && pnpm generate/migrate` to regenerate the database types after changes, or to apply them to the database

## Deployment

-   Create a Postgres database (e.g. via Supabase), and use its connection string as the `DATABASE_URL` secret in the following deployments.
-   Deploy the web app JavaScript build. If using Vercel, you'll have to override the CI/CD install command with `pnpm install --unsafe-perm` so it runs the `packages/core` postinstall step. It correctly fills in all other steps automatically.
-   Deploy the api app using Docker (from the root monorepo context). This repo already has a Github action to automatically deploy to fly.io.
