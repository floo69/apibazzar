FROM node:18-alpine AS builder

WORKDIR /app

COPY package*.json ./

RUN npm install

COPY . .

FROM node:18-alpine

WORKDIR /app

ENV NODE_ENV=production

COPY --from=builder /app/package*.json ./
COPY --from=builder /app/app.js ./

RUN npm ci --only=production && npm cache clean --force

EXPOSE 3000

CMD ["node", "app.js"]