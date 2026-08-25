FROM oven/bun:1.4.0-alpine AS base

WORKDIR /app

RUN apk add --no-cache python3 make g++ libc6-compat

COPY package.json bun.lock ./

RUN HUSKY=0 bun i --ignore-scripts --frozen-lockfile

FROM base AS builder

ENV HUSKY=0

ARG COMMIT_SHA
ARG BRANCH
ARG VIP_ADMIN_ENV_FILE=.env.production

ENV COMMIT_SHA=${COMMIT_SHA}
ENV BRANCH=${BRANCH}

COPY . .

RUN if [ "${VIP_ADMIN_ENV_FILE}" != ".env.production" ]; then cp "${VIP_ADMIN_ENV_FILE}" .env.production; fi
RUN bun run prebuild
RUN bun run build
RUN bun prune --production

FROM oven/bun:1.4.0-alpine AS runner

WORKDIR /app

ENV NODE_ENV=production
ENV HOSTNAME=0.0.0.0

RUN apk add --no-cache libc6-compat

COPY --from=builder /app/.next ./.next
COPY --from=builder /app/package.json ./package.json
COPY --from=builder /app/public ./public
COPY --from=builder /app/node_modules ./node_modules

EXPOSE 3000

CMD ["bun", "run", "start"]
