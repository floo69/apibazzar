# Stage 1: Build
FROM node:18-alpine AS builder
WORKDIR /app

# Copy package files first to leverage Docker cache
COPY package*.json ./
RUN npm install

# Copy the rest of your application code
COPY . .

# Stage 2: Production
FROM node:18-alpine
WORKDIR /app

# Set environment to production for better performance
ENV NODE_ENV=production

# Copy only the necessary files from the builder stage
COPY --from=builder /app/package*.json ./
COPY --from=builder /app/app.js ./
COPY --from=builder /app/node_modules ./node_modules

# Expose the internal port (Must match your app.listen(3000))
EXPOSE 3000

# Start the application
CMD ["node", "app.js"]