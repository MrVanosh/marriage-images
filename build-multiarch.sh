#!/bin/bash

# Exit on error
set -e

# Set your registry and image name
REGISTRY="mrvanosh"
IMAGE_NAME="marriage-images"
TAG="latest"

# Create and use a new builder instance
docker buildx create --name multiarch-builder --use || true

# Build and push for multiple platforms
docker buildx build \
  --platform linux/amd64,linux/arm64 \
  --tag ${REGISTRY}/${IMAGE_NAME}:${TAG} \
  --push \
  .

echo "Multi-architecture build complete!"
echo "Image pushed to: ${REGISTRY}/${IMAGE_NAME}:${TAG}"