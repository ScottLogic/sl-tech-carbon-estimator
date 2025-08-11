#!/bin/bash

set -e

ng build --configuration npm-package

cp README.md package.json ./dist/tech-carbon-estimator/
cd dist/tech-carbon-estimator
npm pkg delete scripts private devDependencies files
npm pkg set main=main.js
