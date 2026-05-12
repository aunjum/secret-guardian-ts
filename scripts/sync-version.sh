#!/usr/bin/env bash
set -euo pipefail

VERSION="${1:-$(git describe --tags --abbrev=0)}"
VERSION_CLEAN="${VERSION#v}"

if ! [[ "${VERSION_CLEAN}" =~ ^[0-9]+\.[0-9]+\.[0-9]+([.-][0-9A-Za-z.-]+)?$ ]]; then
  echo "Refusing to sync invalid semver version: ${VERSION_CLEAN}" >&2
  exit 1
fi

node -e "const fs=require('fs');const p='package.json';const j=JSON.parse(fs.readFileSync(p,'utf8'));j.version='${VERSION_CLEAN}';fs.writeFileSync(p,JSON.stringify(j,null,2)+'\n');"

echo "Synchronized package version to ${VERSION_CLEAN}"
