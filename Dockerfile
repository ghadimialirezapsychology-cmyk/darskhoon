# Dockerfile for DarsKhoon Full-Stack App using Debian Slim (glibc compatible with Vite & Tailwind 4)
FROM node:20-bookworm-slim AS builder

WORKDIR /app

# Copy package files
COPY package*.json ./
RUN npm install

# Copy source code and build client
COPY . .
RUN npm run build

# Production image
FROM node:20-bookworm-slim AS runner

WORKDIR /app
ENV NODE_ENV=production
ENV PORT=5000

COPY package*.json ./
RUN npm install --omit=dev

COPY --from=builder /app/dist ./dist
COPY --from=builder /app/server.js ./server.js
COPY --from=builder /app/data ./data

EXPOSE 5000

CMD ["node", "server.js"]
