#!/bin/bash

# Build and push docs to gh-pages
START_BRANCH=`git rev-parse --abbrev-ref HEAD`
PUBLISH_BRANCH=gh-pages

git checkout $PUBLISH_BRANCH
git pull --no-edit origin $PUBLISH_BRANCH
git merge --no-edit $START_BRANCH
npm run docs
git add docs
git commit -m "Latest documentation"
git push origin $PUBLISH_BRANCH
git checkout $START_BRANCH
