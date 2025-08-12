#!/bin/bash

set -e

schema_version="v0.0.2"
schemas_dir="./src/schemas"

rm -rf $schemas_dir
mkdir $schemas_dir

curl --output "$schemas_dir/tcs-output.json" "https://www.techcarbonstandard.org/schemas/tech_carbon_standard/$schema_version.json"

npx json-schema-typescript-generator --no-index-files

npx prettier ./src/generated/ --write
