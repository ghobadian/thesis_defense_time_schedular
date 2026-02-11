#!/bin/bash

# Simple Backup Script
# This script creates a backup of specified files/directories

# Set variables
BACKUP_SOURCE="$HOME/Documents"
BACKUP_DEST="$HOME/Backups"
DATE=$(date +%Y%m%d_%H%M%S)
BACKUP_NAME="backup_$DATE.tar.gz"

# Colors for output
GREEN='\033[0;32m'
RED='\033[0;31m'
YELLOW='\033[1;33m'
NC='\033[0m' # No Color

# Function to print colored messages
print_message() {
    local color=$1
    local message=$2
    echo -e "${color}${message}${NC}"
}

# Create backup directory if it doesn't exist
if [ ! -d "$BACKUP_DEST" ]; then
    print_message $YELLOW "Creating backup directory..."
    mkdir -p "$BACKUP_DEST"
fi

# Check if source directory exists
if [ ! -d "$BACKUP_SOURCE" ]; then
    print_message $RED "Error: Source directory $BACKUP_SOURCE does not exist!"
    exit 1
fi

# Create the backup
print_message $GREEN "Starting backup process..."
print_message $YELLOW "Source: $BACKUP_SOURCE"
print_message $YELLOW "Destination: $BACKUP_DEST/$BACKUP_NAME"

# Perform the backup
tar -czf "$BACKUP_DEST/$BACKUP_NAME" -C "$(dirname "$BACKUP_SOURCE")" "$(basename "$BACKUP_SOURCE")" 2>/dev/null

# Check if backup was successful
if [ $? -eq 0 ]; then
    # Get backup size
    BACKUP_SIZE=$(du -h "$BACKUP_DEST/$BACKUP_NAME" | cut -f1)
    print_message $GREEN "✓ Backup completed successfully!"
    print_message $GREEN "  Backup file: $BACKUP_NAME"
    print_message $GREEN "  Size: $BACKUP_SIZE"

    # List recent backups
    print_message $YELLOW "\nRecent backups (last 5):"
    ls -lht "$BACKUP_DEST" | grep "backup_" | head -5
else
    print_message $RED "✗ Backup failed!"
    exit 1
fi

# Optional: Remove old backups (keep only last 10)
BACKUP_COUNT=$(ls -1 "$BACKUP_DEST"/backup_*.tar.gz 2>/dev/null | wc -l)
if [ $BACKUP_COUNT -gt 10 ]; then
    print_message $YELLOW "\nRemoving old backups (keeping last 10)..."
    ls -1t "$BACKUP_DEST"/backup_*.tar.gz | tail -n +11 | xargs rm -f
    print_message $GREEN "Old backups removed."
fi

print_message $GREEN "\nBackup script completed!"
