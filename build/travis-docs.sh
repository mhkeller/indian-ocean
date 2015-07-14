#!/bin/bash

# Build docs on Travis and publish to gh-pages

# Only run if on master, not a pull request, and for one node version (so we
# don't end up running this once for each version).
if [ "$TRAVIS_REPO_SLUG" == "mhkeller/indian-ocean" ] && [ "$TRAVIS_PULL_REQUEST" == "false" ] && [ "$TRAVIS_BRANCH" == "master" ] && [ "$TRAVIS_NODE_VERSION" == "0.12" ]; then

  echo "Publishing docs...\n"

  git config --global user.email "travis@travis-ci.org"
  git config --global user.name "travis-ci"

  cd $HOME
  git clone --quiet https://${GH_TOKEN}@github.com/$TRAVIS_REPO_SLUG build-docs > /dev/null
  cd build-docs
  npm install
  ./build/docs.sh

  echo "Published docs to gh-pages.\n"

fi
