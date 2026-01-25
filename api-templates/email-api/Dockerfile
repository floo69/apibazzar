# Stage 1: Build Stage (The "Kitchen")
FROM node:20-alpine AS builder

# Set the working directory
WORKDIR /app

# Copy package files first to leverage Docker cache
COPY package*.json ./

# Install ALL dependencies (including dev if any)
RUN npm install

# Copy the rest of your app code
COPY . .

# --- Stage 2: Production Stage (The "Serving Table") ---
FROM node:20-alpine

# Set to production for better performance
ENV NODE_ENV=production

WORKDIR /app

# Only copy the essential files from the builder stage
COPY --from=builder /app/package*.json ./
COPY --from=builder /app/app.js ./
COPY --from=builder /app/node_modules ./node_modules

# Expose the port your Express app runs on
EXPOSE 3000

# Use 'node' directly instead of 'npm start' to save memory and handle signals better
CMD ["node", "app.js"]