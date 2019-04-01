#!/bin/bash

BUMP_TYPE=$1

echo "bump type: $BUMP_TYPE"

npm update
npm run build

VERSION=$(npm --no-git-tag-version version patch)
echo "new version: $VERSION"

git add .
git commit -m "$VERSION"
git tag $VERSION -f
git push

npm publish --access=public
