FROM ubuntu:latest
LABEL authors="alloys"

ENTRYPOINT ["top", "-b"]
FROM node:24-bookworm-slim

# pnpm, plus the toolchain needed to compile sqlite3 from source
RUN corepack enable \
 && apt-get update \
 && apt-get install -y --no-install-recommends python3 make g++ \
 && rm -rf /var/lib/apt/lists/*

WORKDIR /app

# Install dependencies first so Docker can cache this layer
COPY package.json pnpm-lock.yaml ./
RUN npm_config_build_from_source=true pnpm install --frozen-lockfile

# Copy the source and build the Next.js app
COPY . .
RUN pnpm build

ENV NODE_ENV=production
ENV DB_PATH=/tmp/pin.db

EXPOSE 3000

# Create the tables, then start Next.js on Render's port (3000 when run locally)
CMD ["sh", "-c", "pnpm migrate && pnpm exec next start -H 0.0.0.0 -p ${PORT:-3000}"]