# Use Node.js 20 as base image (required for Next.js 16)
FROM node:20-slim

# Install Python and system dependencies for matplotlib
RUN apt-get update && apt-get install -y \
    python3 \
    python3-pip \
    python3-venv \
    gcc \
    libfreetype6-dev \
    libpng-dev \
    && rm -rf /var/lib/apt/lists/*

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
ENV NEXT_PUBLIC_PPT_SERVICE_URL=http://localhost:8000

# Build the application
RUN npm run build

# Install Python PPT service dependencies
COPY ppt-service/requirements.txt /tmp/requirements.txt
RUN pip3 install --break-system-packages --no-cache-dir -r /tmp/requirements.txt

# Copy Python PPT service code
COPY ppt-service/src/ /app/ppt-service/src/

# Expose ports
EXPOSE 7860 8000

# Set environment to production
ENV NODE_ENV=production
ENV PORT=7860
ENV PYTHONUNBUFFERED=1

# Create startup script to run both services
RUN echo '#!/bin/bash\n\
echo "Starting PPT Service on port 8000..."\n\
cd /app/ppt-service/src && python3 main.py &\n\
PPT_PID=$!\n\
echo "PPT Service started with PID: $PPT_PID"\n\
echo "Starting Next.js on port 7860..."\n\
npm start &\n\
NEXT_PID=$!\n\
echo "Next.js started with PID: $NEXT_PID"\n\
# Wait for both processes\n\
wait $PPT_PID $NEXT_PID' > /app/start.sh && chmod +x /app/start.sh

# Start both services
CMD ["/app/start.sh"]
