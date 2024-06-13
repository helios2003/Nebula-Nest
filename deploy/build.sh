#!/bin/bash
set -e

if [ -z "$1" ] || [ -z "$2" ]; then
  echo "Usage: $0 <Dockerfile-path> <local-directory-path>"
  exit 1
fi

DOCKERFILE_PATH=$1
LOCAL_DIRECTORY_PATH=$2
IMAGE_NAME=$(basename "$LOCAL_DIRECTORY_PATH" | sed 's/.*\///; s/\..*//')
CONTAINER_NAME="$IMAGE_NAME"

docker build -f "$DOCKERFILE_PATH" -t "$IMAGE_NAME" .
docker run -dit "$CONTAINER_NAME"

# wait for it to start due to system reasons
sleep 5

CONTAINER_ID=$(docker ps -q -f ancestor="$IMAGE_NAME")

if [ -n "$CONTAINER_ID" ]; then
  # copy files
  echo "Container $CONTAINER_ID sucessfully created!!"
  docker cp "$LOCAL_DIRECTORY_PATH" "$CONTAINER_ID:/home/app"
  docker exec "$CONTAINER_ID" sh -c "cd /home/app/$IMAGE_NAME/frontend && npm install && npm run build"
  docker cp "$CONTAINER_ID:/home/app/$IMAGE_NAME/frontend/dist" "$LOCAL_DIRECTORY_PATH/dist"
else
  echo "Error: The container $CONTAINER_NAME is not running."
  echo "Logs from the container:"
  docker logs "$CONTAINER_NAME"
  exit 1
fi
