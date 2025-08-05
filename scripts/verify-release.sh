#!/bin/bash

set -e

cd dist/tech-carbon-estimator

VERSION=$(npm pkg get version --workspaces=false | tr -d \")
if [ ${VERSION} == "0.0.0-semantically-released" ]
then
  echo "::error::semantic-release did not produce a new package version"
  exit 1
fi
