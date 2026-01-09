#!/bin/bash
# Bash script to copy assets to public folder
# Run this script to move assets from src/assests to public/assets

SOURCE_DIR="src/assests"
DEST_DIR="public/assets"

if [ -d "$SOURCE_DIR" ]; then
    mkdir -p "$DEST_DIR"
    cp -r "$SOURCE_DIR"/* "$DEST_DIR"/
    echo "Assets copied successfully to public/assets"
else
    echo "Source directory not found: $SOURCE_DIR"
fi

