# Base image
FROM node:25-alpine AS base

# Install dependencies stage
FROM base AS deps
WORKDIR /app
RUN npm install -g pnpm
COPY package.json pnpm-lock.yaml ./
COPY prisma ./prisma
COPY prisma.config.ts ./
# prisma.config ładuje DATABASE_URL; przy generate nie jest potrzebne prawdziwe połączenie
ENV DATABASE_URL="postgresql://postgres:postgres@localhost:5432/postgres?schema=public"
RUN pnpm install --frozen-lockfile
RUN pnpm exec prisma generate

# Development stage – use this for docker-compose dev
FROM base AS dev
RUN npm install -g pnpm
WORKDIR /app
COPY --from=deps /app/node_modules ./node_modules
COPY . .
EXPOSE 3000
ENV NODE_ENV=development
CMD ["pnpm", "run", "dev"]