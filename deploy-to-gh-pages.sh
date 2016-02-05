#!/bin/bash
# See https://medium.com/@nthgergo/publishing-gh-pages-with-travis-ci-53a8270e87db

if [ "$TRAVIS_PULL_REQUEST" != "false" -o "$TRAVIS_BRANCH" != "master" ] 
  then exit 0 
fi
set -o errexit

# deploy
cd dist
git init
git add .
git commit -m "Deploy to Github Pages"
git push --force --quiet "https://${GITHUB_TOKEN}@${GITHUB_REPO}.git" master:gh-pages > /dev/null 2>&1