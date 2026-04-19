# Use Node.js 20 as base image (required for Next.js 16)
FROM node:20-slim

# Set working directory
WORKDIR /app

# Copy package files from frontend/next-app
COPY frontend/next-app/package*.json ./

# Install dependencies (use npm install since package-lock.json might not be at root)
RUN npm install

# Copy the rest of the application
COPY frontend/next-app/ .

# Set placeholder environment variables for build time
# (Actual values will be set by Hugging Face at runtime)
ENV NEON_DATABASE_URL=postgresql://placeholder:placeholder@placeholder.postgres.database.azure.com/neondb?sslmode=require
ENV OPENAI_API_KEY=sk-placeholder
ENV PINECONE_API_KEY=placeholder
ENV PINECONE_ENVIRONMENT=us-east-1-aws
ENV PINECONE_INDEX=product-pilot
ENV NEXT_PUBLIC_PPT_SERVICE_URL=https://ashishsankhua-ppt-microservice.hf.space

# Build the application
RUN npm run build

# Expose port 7860 (Hugging Face Spaces default)
EXPOSE 7860

# Set environment to production
ENV NODE_ENV=production
ENV PORT=7860

# Start the application
CMD ["npm", "start"]
