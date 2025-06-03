FROM node:20-alpine

WORKDIR /app

# Required for zlib-sync
RUN apk add --no-cache build-base python3

COPY package*.json ./
RUN npm install --omit=dev

COPY . .
RUN npm run build

CMD [ "node", "dist/index.js" ]
