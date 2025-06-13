FROM node:22.16.0-slim AS base
RUN apt-get update && apt-get install -y ffmpeg && \
    rm -rf /var/lib/apt/lists/*
WORKDIR /usr/src/app
RUN corepack enable

# -----------------
# Etapa de Dependencias (para desarrollo)
# -----------------
FROM base AS deps
COPY package.json pnpm-lock.yaml ./
RUN pnpm install --frozen-lockfile

# -----------------
# Etapa de Desarrollo (PERFECTA COMO ESTÁ)
# -----------------
FROM deps AS development
COPY . .
CMD [ "pnpm", "run", "dev" ]

# -----------------
# Etapa de Producción (OPTIMIZADA)
# -----------------
FROM base AS production
COPY package.json pnpm-lock.yaml ./
RUN pnpm install --prod --frozen-lockfile
COPY . .
EXPOSE 4500
CMD [ "pnpm", "start" ]