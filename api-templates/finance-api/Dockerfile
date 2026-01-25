# Stage 1: The "Kitchen" (Build Stage)
FROM node:18-alpine AS builder

WORKDIR /app

# Copy only package files first to cache the 'npm install' layer
COPY package*.json ./

# Install dependencies (Express, Axios, etc.)
RUN npm install

# Copy the actual app code
COPY . .

# Stage 2: The "Serving Table" (Production Stage)
FROM node:18-alpine

# Set to production for speed and security
ENV NODE_ENV=production

WORKDIR /app

# Only copy necessary files from the builder
COPY --from=builder /app/package*.json ./
COPY --from=builder /app/app.js ./
COPY --from=builder /app/node_modules ./node_modules

# Expose the internal port
EXPOSE 3000

# Use 'node' directly to handle OS signals (SIGTERM) properly
CMD ["node", "app.js"]