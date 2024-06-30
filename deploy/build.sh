#!/bin/bash
set -e

if [ -z "$1" ] || [ -z "$2" ]; then
  echo "Usage: $0 <Dockerfile-path> <local-directory-path>"
  exit 1
fi

DOCKERFILE_PATH=$1
LOCAL_DIRECTORY_PATH=$2
FRONTEND_DIR=$3
INSTALL_COMMAD=$4
BUILD_COMMAND=$5
OUTPUT_DIRECTORY_PATH=$6
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
  docker exec "$CONTAINER_ID" sh -c "apk add --no-cache bash"
  docker exec "$CONTAINER_ID" bash -c "
  cd $IMAGE_NAME/$FRONTEND
  $INSTALL_COMMAND
  $BUILD_COMMAND
  "
  docker cp "$CONTAINER_ID:/home/app/$IMAGE_NAME/$FRONTEND/$OUTPUT_DIRECTORY_PATH" "$LOCAL_DIRECTORY_PATH/$OUTPUT_DIRECTORY_PATH"
  docker rm -vf $(docker ps -a -q)
  docker rmi -f $(docker images -a -q)
else
  echo "Error: The container $CONTAINER_NAME is not running."
  echo "Logs from the container:"
  docker logs "$CONTAINER_NAME"
  exit 1
fi
