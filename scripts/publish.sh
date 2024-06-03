#!/bin/bash

# This script is used to publish the package to npm, flags can be used to specify the version bump type and whether to run in dry run mode
# -v: version bump type. Set to one of major, minor, or patch
# -d: dry run mode, will not publish to npm. No value needed just need to add flag

set -e

dryRun='false'
bump=patch

while getopts v:d flag
do
    case "${flag}" in
        v) bump=${OPTARG};;
        d) dryRun='true';;
        \?) exit 1;;
    esac
done

# Check if npm is logged in
if ! npm whoami &> /dev/null; then
  echo "Please log in to npm before running this script, run npm login"
  exit 1
fi

# Get version bump
if [ "$bump" != "major" ] && [ "$bump" != "minor" ] && [ "$bump" != "patch" ]; then
  echo "Invalid version bump type provided, specfiy one of major, minor, or patch"
  exit 1
fi

# Remove current dist folder
rm -rf /dist/tech-carbon-estimator

# Build and test
npm run prepare

npm run test

# Update version and commit version bump and tag
npm version $bump

version=$(npm pkg get version --workspaces=false | tr -d \")

# Publish to npm
cp README.md package.json ./dist/tech-carbon-estimator/

cd dist/tech-carbon-estimator

npm pkg delete scripts private devDependencies files

npm pkg set main=main.js

npm pack

publishFile=tech-carbon-estimator-"${version}".tgz

if [ "$dryRun" = 'true' ]; then
  npm publish $publishFile --dry-run
else
  npm publish $publishFile
fi

echo "Published version $version to npm, run git push --follow-tags to push version update to git"
