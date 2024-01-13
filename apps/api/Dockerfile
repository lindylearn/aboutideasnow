# syntax = docker/dockerfile:1

# Adjust NODE_VERSION as desired
ARG NODE_VERSION=18.16.1
FROM node:${NODE_VERSION}-slim as base

LABEL fly_launch_runtime="Node.js/Prisma"

# Node.js/Prisma app lives here
WORKDIR /app

# Set production environment
ENV NODE_ENV="production"


# Throw-away build stage to reduce size of final image
FROM base as build

# Install packages needed to build node modules
RUN apt-get update -qq && \
    apt-get install -y build-essential openssl pkg-config python-is-python3

# Copy application code
COPY --link . .

# Install dev CLIs
RUN npm install -g pnpm turbo

# Install dependencies
RUN turbo prune @repo/api --docker
RUN pnpm install --frozen-lockfile

# Build application
RUN pnpm build --filter=@repo/api

# Remove development dependencies
RUN pnpm install --prod


# Final stage for app image
FROM base

# Install packages needed for deployment
RUN apt-get update -qq && \
    apt-get install --no-install-recommends -y chromium chromium-sandbox openssl && \
    rm -rf /var/lib/apt/lists /var/cache/apt/archives

# Copy built application
COPY --from=build /app /app

# Start the server by default, this can be overwritten at runtime
EXPOSE 3000
ENV PUPPETEER_EXECUTABLE_PATH="/usr/bin/chromium"
CMD [ "node", "apps/api/dist/index.js" ]
