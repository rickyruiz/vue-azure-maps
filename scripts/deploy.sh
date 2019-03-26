#!/usr/bin/env sh

# abort on errors
set -e

# clean
yarn run docs:clean

# build
yarn run docs:build

# commit
git commit -m 'docs(deploy): 📝 update documentation'

# push
git push origin master

cd -