# Stage 1: Dependencies
FROM node:20-slim AS builder

# Set working directory
WORKDIR /app

# Copy package.json and package-lock.json
COPY package*.json ./

# Install dependencies with exact versions from package-lock.json
RUN npm ci --only=production

# Stage 2: Runtime
FROM node:20-slim

# Set environment variables
ENV NODE_ENV=production
ENV PORT=3000

# Create a non-root user
RUN groupadd -r nodeuser && useradd -r -g nodeuser -u 1001 nodeuser

# Set working directory
WORKDIR /app

# Copy node_modules from builder stage
COPY --from=builder /app/node_modules ./node_modules

# Copy application files
COPY . .

# Set proper permissions
RUN chown -R nodeuser:nodeuser /app

# Switch to non-root user
USER nodeuser

# Expose the port the app runs on
EXPOSE 3000

# Command to run the application
CMD ["npm", "start"]

# Add healthcheck
HEALTHCHECK --interval=30s --timeout=5s --start-period=5s --retries=3 \
  CMD node -e "try { require('http').get('http://localhost:' + (process.env.PORT || 3000) + '/', (res) => res.statusCode === 200 ? process.exit(0) : process.exit(1)); } catch (err) { process.exit(1); }"

