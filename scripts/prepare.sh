#!/bin/bash

set -e

npm run build:css
npm run build-demo

cp README.md package.json ./dist/tech-carbon-estimator/
cd dist/tech-carbon-estimator
npm pkg delete scripts private devDependencies files
npm pkg set main=main.js
