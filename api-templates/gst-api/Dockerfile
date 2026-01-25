# Stage 1: Build
FROM node:18-alpine AS builder
WORKDIR /app

# Copy only package files to use Docker cache
COPY package*.json ./
RUN npm install

# Copy source code
COPY . .

# Stage 2: Production
FROM node:18-alpine
WORKDIR /app

# Set environment to production
ENV NODE_ENV=production

# Copy built files from builder stage
COPY --from=builder /app/package*.json ./
COPY --from=builder /app/app.js ./

# Install only production dependencies
RUN npm install --only=production && npm cache clean --force

# Expose the API port
EXPOSE 3000

# Start the application
CMD ["node", "app.js"]