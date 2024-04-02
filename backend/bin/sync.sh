#!/bin/bash

### Download all notes from notepad.mx to our own local storage folder

# URL of the .tar.gz archive
ARCHIVE_URL="https://notepad.mx/archive.tar.gz"

# Define directories
BIN_DIR="$(dirname "$(readlink -f "$0")")"
BACKEND_DIR="$(dirname "$BIN_DIR")"
STORAGE_DIR="$BACKEND_DIR/storage"

# Download the archive
echo "Downloading archive from $ARCHIVE_URL..."
wget -q "$ARCHIVE_URL" -O archive.tar.gz

# Check if download was successful
if [ $? -eq 0 ]; then

  echo "Download successful."

  # Extract contents to the specified directory
  tar -xzf archive.tar.gz --strip-components=1 --skip-old-files -C "$STORAGE_DIR"

  # Check if extraction was successful
  if [ $? -eq 0 ]; then
    echo "Extraction successful."
  else
    echo "Error: Failed to extract contents."
  fi
  # Clean up: remove the downloaded archive
  rm archive.tar.gz
else
  echo "Error: Failed to download archive from $ARCHIVE_URL."
fi
