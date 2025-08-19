# Multi-stage build for production
FROM node:20-alpine AS builder

# Install npm (already included with Node.js)
# No need to install npm globally

# Set working directory
WORKDIR /app

# Copy package files
COPY package.json ./
COPY core/package.json ./core/
COPY ui/package.json ./ui/
COPY extensions/vscode/package.json ./extensions/vscode/
COPY docs/package.json ./docs/
COPY packages/*/package.json ./packages/

# Install dependencies
RUN npm install

# Copy source code
COPY . .

# Build all packages
RUN npm run build

# Production stage
FROM node:20-alpine AS production

# Install npm
# No need to install npm globally

# Set working directory
WORKDIR /app

# Copy package files
COPY package.json ./
COPY core/package.json ./core/
COPY ui/package.json ./ui/
COPY extensions/vscode/package.json ./extensions/vscode/
COPY docs/package.json ./docs/
COPY packages/*/package.json ./packages/

# Install production dependencies
RUN npm install --only=production

# Copy built files from builder
COPY --from=builder /app/core/dist ./core/dist
COPY --from=builder /app/ui/dist ./ui/dist
COPY --from=builder /app/extensions/vscode/out ./extensions/vscode/out
COPY --from=builder /app/docs/build ./docs/build
COPY --from=builder /app/packages/*/dist ./packages/*/dist

# Expose ports
EXPOSE 3000 3001 3002

# Start production
CMD ["npm", "start"]
