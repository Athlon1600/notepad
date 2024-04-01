#!/bin/bash

# Define directories
SCRIPT_DIR=$(dirname "$0")
BACKEND_DIR=$(readlink -f "$(dirname "$SCRIPT_DIR")")
STORAGE_DIR="$BACKEND_DIR/storage"
ARCHIVE_DIR="$BACKEND_DIR/public"

if [ ! -d "$STORAGE_DIR" ]; then
  echo "storage directory ($STORAGE_DIR) not found."
  exit 1
fi

if [ ! -d "$ARCHIVE_DIR" ]; then
  echo "public directory '$ARCHIVE_DIR' not found."
  exit 1
fi

# change to storage directory just in case
tar -czf archive.tar.gz -C "$BACKEND_DIR" storage && mv archive.tar.gz "$ARCHIVE_DIR"

echo "$ARCHIVE_DIR"
