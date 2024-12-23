#!/bin/bash

# Variables
REMOTE_USER="pawel"
REMOTE_HOST="vypas.com"
REMOTE_PORT="1222"
REMOTE_DIR="~/audio/container/binaural-audio-survey"
EXCLUDE_DIR="node_modules"
K8S_CONFIG_FILE="config.yml"

# Copy files to the remote directory, excluding 'node_modules'
echo "Syncing files to remote server..."
rsync -avz --exclude="$EXCLUDE_DIR" -e "ssh -p $REMOTE_PORT" ./ "$REMOTE_USER@$REMOTE_HOST:$REMOTE_DIR"

if [ $? -ne 0 ]; then
  echo "Error during file sync. Exiting."
  exit 1
fi

# Run commands on the remote server
echo "Running commands on remote server..."
ssh -p "$REMOTE_PORT" "$REMOTE_USER@$REMOTE_HOST" <<EOF
  set -e
  echo "Building and pushing Docker images..."
  cd ~/audio/container
  docker compose build
  docker compose push
  echo "Rolling out Kubernetes deployments..."
  kubectl apply -f ~/audio/$K8S_CONFIG_FILE
  kubectl -n vaigu rollout restart deployment frontend -n audio
EOF

if [ $? -ne 0 ]; then
  echo "Error during remote execution. Exiting."
  exit 1
fi

echo "Deployment completed successfully!"