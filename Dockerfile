FROM node:20-alpine AS base

# Required for zlib-sync
RUN apk add --no-cache build-base python3


# Install node modules
FROM base AS modules
WORKDIR /app

# Install dependencies
COPY package*.json ./
RUN npm ci --omit=dev

# Compile typescript
FROM base AS compiler
WORKDIR /app

COPY --from=modules /app/node_modules ./node_modules
COPY . .

RUN npm run build


# Final image
FROM base AS runner
ENV NODE_ENV=production
WORKDIR /app

COPY --from=modules --chown=node:node /app/node_modules ./node_modules
COPY --from=compiler --chown=node:node /app/dist ./dist

USER node
CMD [ "node", "dist/index.js" ]
