#!/bin/bash

BUMP_TYPE=${1:-patch}

npm update
npm run build

VERSION=$(npm --no-git-tag-version version ${BUMP_TYPE})
echo "new version: $VERSION"

git add .
git commit -m "$VERSION"
git tag $VERSION -f
git push

npm publish --access=public
