# ── Stage 1: Dependencies ───────────────────────────────────────
FROM node:20-alpine AS deps

WORKDIR /app

COPY package*.json ./
RUN npm install --omit=dev --ignore-scripts

# ── Stage 2: Production image ───────────────────────────────────
FROM node:20-alpine AS runner

WORKDIR /app

ENV NODE_ENV=production

# Non-root user for security
RUN addgroup --system --gid 1001 nodejs && \
    adduser --system --uid 1001 cymor

COPY --from=deps /app/node_modules ./node_modules
COPY . .

# Remove dev files
RUN rm -f .env* *.md Dockerfile docker-compose.yml

USER cymor

EXPOSE 5000

CMD ["node", "src/server.js"]
