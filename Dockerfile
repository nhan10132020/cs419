# Base image for building
FROM node:20-alpine AS builder

WORKDIR /app

# Copy dependencies
COPY package*.json ./
RUN npm install

# Copy all app files
COPY . .

# Build the app
RUN npm run build

# Production image
FROM node:20-alpine AS runner
WORKDIR /app

ENV NODE_ENV=production

COPY --from=builder /app/public ./public
COPY --from=builder /app/.next ./.next
COPY --from=builder /app/node_modules ./node_modules
COPY --from=builder /app/package.json ./package.json
COPY --from=builder /app/jsconfig.json ./jsconfig.json
COPY --from=builder /app/next.config.mjs ./next.config.mjs
COPY --from=builder /app/postcss.config.mjs ./postcss.config.mjs

EXPOSE 3000

CMD ["npm", "start"]
