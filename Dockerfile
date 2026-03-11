# Stage 1: Dependencies
FROM node:20-slim AS builder

# Set working directory
WORKDIR /app

# Copy package files for dependency installation
COPY package*.json ./

# Install dependencies with exact versions from package-lock.json
RUN npm ci --omit=dev && npm cache clean --force

# Stage 2: Runtime using Alpine for minimal size and security
FROM node:20-alpine

# Set security-related environment variables
ENV NODE_ENV=production
ENV PORT=3000
# Set secure Node.js options
ENV NODE_OPTIONS="--max-http-header-size=8192 --no-deprecation"

# Create a non-root user and set permissions
RUN addgroup -g 1001 nodeapp && \
    adduser -u 1001 -G nodeapp -s /bin/sh -D nodeapp && \
    mkdir -p /app && \
    chown -R nodeapp:nodeapp /app

# Set working directory
WORKDIR /app

# Copy node_modules from builder stage
COPY --from=builder --chown=nodeapp:nodeapp /app/node_modules ./node_modules

# Copy application files
COPY --chown=nodeapp:nodeapp server.js package.json ./
COPY --chown=nodeapp:nodeapp src ./src

# Switch to non-root user
USER nodeapp

# Expose the port the app runs on
EXPOSE 3000

# Command to run the application
CMD ["node", "server.js"]

# Add healthcheck
HEALTHCHECK --interval=30s --timeout=5s --start-period=5s --retries=3 \
    CMD wget -qO- http://localhost:3000/healthz || exit 1

