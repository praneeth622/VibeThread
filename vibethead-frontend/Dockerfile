# Use Node.js as the base image
FROM node:20-slim AS builder

# Set working directory
WORKDIR /app

# Copy package files
COPY package*.json ./

# Install dependencies
RUN npm ci

# Copy all files
COPY . .

# Update browserslist database
RUN npx update-browserslist-db@latest

# Build the application
RUN npm run build

# Use a smaller image for production
FROM node:20-slim AS runner

# Set working directory
WORKDIR /app

# Install serve
RUN npm install -g serve

# Copy built application from builder stage
COPY --from=builder /app/out ./out
COPY --from=builder /app/package.json ./package.json

# Expose the port
EXPOSE 3000

# Start the application
CMD ["npx", "serve", "-s", "out", "-p", "3000"]