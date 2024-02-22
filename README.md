# About Ideas Now

aboutideasnow.com indexes the /about, /ideas, and /now pages of 1000s of personal websites, and lets you search across them.
The purpose is to help you find interesting people and talk to them.

If you want to help improve the website, please open a Github issue!

## Code structure

This project uses Turborepo with a number of packages:

-   `apps/web`: A SvelteKit web app for the aboutideasnow.com website
-   `apps/api`: A Node.js server to run periodic website scrapes
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
