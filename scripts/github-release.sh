#!/bin/bash

# Ran after the build is published and version and change log have been merged into the main branch

version=$(npm pkg get version --workspaces=false | tr -d \")
# Remove --pre-release flag when estimator is ready for production
gh release create v$version ./dist/tech-carbon-estimator/*.tgz --pre-release
