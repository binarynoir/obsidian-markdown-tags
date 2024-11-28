#!/usr/bin/env bash

# Extract the version number from the package.json file
VERSION=$(grep -Eo '"version": "[0-9]+\.[0-9]+\.[0-9]+"' package.json | cut -d '"' -f 4)

# Check if the version number was found
if [ -z "$VERSION" ]; then
    echo "Version number not found in package.json."
    exit 1
fi

# Ensure repo is up-to-date
git pull

# Create an annotated tag
git tag -a "$VERSION" -m "$VERSION"

# Push all tags to the repository
git push --tags

echo "Tag $VERSION created and pushed to the repository."
