#!/usr/bin/env bash
set -euo pipefail

VERSION="${1:-$(git describe --tags --abbrev=0)}"
VERSION_CLEAN="${VERSION#v}"

node -e "const fs=require('fs');const p='package.json';const j=JSON.parse(fs.readFileSync(p,'utf8'));j.version='${VERSION_CLEAN}';fs.writeFileSync(p,JSON.stringify(j,null,2)+'\n');"

echo "Synchronized package version to ${VERSION_CLEAN}"
