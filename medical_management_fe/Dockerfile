# Multi-stage build for React frontend
FROM --platform=linux/amd64 node:20-alpine AS builder

WORKDIR /app

# Copy package files
COPY package.json yarn.lock ./

# Install dependencies
RUN yarn install --frozen-lockfile

# Copy source code
COPY . .

# Accept build arguments for environment variables
ARG VITE_API_URL
ARG VITE_BACKEND_URL

# Set environment variables for build
ENV VITE_API_URL=$VITE_API_URL
ENV VITE_BACKEND_URL=$VITE_BACKEND_URL

# Build the application
RUN yarn build

# Production stage
FROM --platform=linux/amd64 nginx:alpine

# Copy built files from builder stage
COPY --from=builder /app/dist /usr/share/nginx/html

# Copy nginx configuration
COPY nginx.conf /etc/nginx/conf.d/default.conf

# Expose port 9901
EXPOSE 9901

# Start nginx
CMD ["nginx", "-g", "daemon off;"]
