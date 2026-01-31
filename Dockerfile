# This Dockerfile uses `serve` npm package to serve the static files with node process.
# You can find the Dockerfile for nginx in the following link:
# https://github.com/refinedev/dockerfiles/blob/main/vite/Dockerfile.nginx
FROM refinedev/node:20 AS base

FROM base as deps

COPY package.json package-lock.json* ./

RUN npm install --legacy-peer-deps

FROM base AS builder

ENV NODE_ENV production

COPY --from=deps /app/refine/node_modules ./node_modules

COPY . .

RUN npm run build

FROM base AS runner

ENV NODE_ENV production

COPY package.json ./
RUN npm install --legacy-peer-deps --production express serve-static

COPY --from=builder /app/refine/dist ./dist
COPY server.js ./

USER refine

CMD ["node", "server.js"]
