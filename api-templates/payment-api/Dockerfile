# Use a slim, secure base image
FROM node:18-alpine

# Set environment to production to skip dev-dependencies
ENV NODE_ENV=production

# Create and use a dedicated app directory
WORKDIR /usr/src/app

# Copy package files first to leverage Docker layer caching
COPY package*.json ./

# Install only production dependencies
RUN npm install --omit=dev

# Copy the rest of your app code
COPY . .

# Run the container as a non-root user for security
USER node

# Match the port in your app.js
EXPOSE 3000

# Use 'node' directly instead of 'npm start' to handle signals properly
CMD ["node", "app.js"]