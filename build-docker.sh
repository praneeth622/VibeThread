#!/bin/bash
cd /workspaces/VibeThread
echo "Building Docker image for vibethead-frontend..."
docker build -t vibethread-frontend ./vibethead-frontend
if [ $? -eq 0 ]; then
    echo "Docker build successful!"
    echo "You can run the container with: docker run -p 3000:3000 vibethread-frontend"
else
    echo "Docker build failed. Check the error messages above."
fi
