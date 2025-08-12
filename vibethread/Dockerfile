# syntax=docker/dockerfile:1

# Use Node.js 20 LTS as base image
FROM node:20-slim AS base

# Install system dependencies
RUN apt-get update && apt-get install -y \
    ffmpeg \
    python3 \
    python3-pip \
    python3-venv \
    curl \
    wget \
    ca-certificates \
    && rm -rf /var/lib/apt/lists/*

# Install yt-dlp using --break-system-packages flag
RUN pip3 install --no-cache-dir --break-system-packages yt-dlp

# Verify installations
RUN ffmpeg -version && yt-dlp --version

# Create app directory and set permissions
WORKDIR /app
RUN mkdir -p /app/public/audio/downloads && \
    chmod 755 /app/public/audio/downloads

# Copy package files
COPY package*.json ./

# Install dependencies
RUN npm ci --only=production && npm cache clean --force

# Copy application code
COPY . .

# Build the application
RUN npm run build

# Create non-root user for security
RUN groupadd -r appuser && useradd -r -g appuser appuser
RUN chown -R appuser:appuser /app
USER appuser

# Expose the port
EXPOSE 3000

# Health check
HEALTHCHECK --interval=30s --timeout=3s --start-period=5s --retries=3 \
    CMD curl -f http://localhost:3000/api/audio/health || exit 1

# Set environment variables
ENV NODE_ENV=production
ENV PORT=3000

# Create volume for temporary files
VOLUME ["/app/public/audio/downloads"]

# Start the application
CMD ["npm", "run", "start:prod"]
