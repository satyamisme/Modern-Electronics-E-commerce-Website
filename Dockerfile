# Stage 1: Build the React application
FROM node:18-alpine AS builder

LABEL maintainer="Jules the AI Assistant"
LABEL description="Build stage for the Modern Electronics E-commerce Website"

WORKDIR /app

# Copy package.json and package-lock.json (or yarn.lock if used)
# This leverages Docker cache for dependencies unless these files change
COPY package.json package-lock.json* ./

# Install dependencies
# Using --legacy-peer-deps as it was mentioned in a previous iteration,
# can be removed if peer dependency conflicts are resolved.
# Consider 'npm ci' for faster, more reliable builds if you have a package-lock.json
RUN npm install --legacy-peer-deps

# Copy the rest of the application source code
COPY . .

# Build the application for production
# The output will be in the /app/dist directory (default for Vite)
RUN npm run build

# Stage 2: Serve the application using Nginx
FROM nginx:1.25-alpine

LABEL maintainer="Jules the AI Assistant"
LABEL description="Production stage for the Modern Electronics E-commerce Website with Nginx"

# Copy built assets from the builder stage's /app/dist directory
COPY --from=builder /app/dist /usr/share/nginx/html

# Optional: Copy a custom Nginx configuration file if needed.
# This default Nginx image is configured to serve files from /usr/share/nginx/html.
# For SPAs (Single Page Applications) like React, you might need a custom Nginx config
# to ensure all routes are directed to index.html to let React Router handle them.
# Example:
# COPY nginx.conf /etc/nginx/conf.d/default.conf
#
# A simple nginx.conf for a React SPA might look like this:
# server {
#    listen 80;
#    server_name localhost;
#
#    root /usr/share/nginx/html;
#    index index.html index.htm;
#
#    location / {
#        try_files $uri $uri/ /index.html;
#    }
#
#    # Optional: Add cache control headers for static assets
#    location ~* \.(?:css|js|jpg|jpeg|gif|png|ico|webp|svg|woff|woff2|ttf|eot)$ {
#        expires 1y;
#        add_header Cache-Control "public";
#    }
# }

# Expose port 80 (Nginx default HTTP port)
EXPOSE 80

# Start Nginx in the foreground when the container launches
CMD ["nginx", "-g", "daemon off;"]
