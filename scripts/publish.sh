#!/bin/bash
set -e

# Check if npm is logged in
if ! npm whoami &> /dev/null; then
  echo "Please log in to npm before running this script, run npm login"
  exit 1
fi

# Get version bump
bump=patch
if [ -z "$1" ]; then
  echo "No version bump type provided, defaulting to patch"
elif [ "$1" = "major" ] || [ "$1" = "minor" ] || [ "$1" = "patch" ]; then
  bump= $1
else
  echo "Invalid version bump type provided, specfiy one of major, minor, or patch"
  exit 1
fi

# Remove current dist folder
rm -rf /dist/tech-carbon-estimator

# Build and test
npm run build

npm run test

# Update version and commit version bump and tag
npm version $bump

version=$(npm pkg get version --workspaces=false | tr -d \")

# Publish to npm
cp README.md LICENSE package.json ./dist/tech-carbon-estimator/

cd dist/tech-carbon-estimator

npm pkg delete scripts private devDependencies

npm pkg set main=main.js

npm pack

publishFile=tech-carbon-estimator-"${version}".tgz

npm publish $publishFile

echo "Published version $version to npm, run git push --follow-tags to push version update to git"
