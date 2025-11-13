# Build stage
FROM node:18-alpine AS builder

WORKDIR /app

# Copy package files
COPY package*.json ./

# Install dependencies
RUN npm ci

# Copy source code
COPY . .

# Build both frontend and backend
RUN npm run build

# Production stage
FROM node:18-alpine

WORKDIR /app

# Copy package files
COPY package*.json ./

# Install production dependencies only
RUN npm ci --only=production

# Copy built files from builder (both frontend and backend)
COPY --from=builder /app/dist ./dist

# Set production environment
ENV NODE_ENV=production

# Expose port (Railway will set PORT env var)
EXPOSE 3001

# Start the server
CMD ["node", "dist/server/index.js"]
