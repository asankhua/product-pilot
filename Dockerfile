# Use Node.js 18 as base image
FROM node:18-slim

# Set working directory
WORKDIR /app

# Copy package files from frontend/next-app
COPY frontend/next-app/package*.json ./

# Install dependencies (use npm install since package-lock.json might not be at root)
RUN npm install

# Copy the rest of the application
COPY frontend/next-app/ .

# Build the application
RUN npm run build

# Expose port 7860 (Hugging Face Spaces default)
EXPOSE 7860

# Set environment to production
ENV NODE_ENV=production
ENV PORT=7860

# Start the application
CMD ["npm", "start"]
