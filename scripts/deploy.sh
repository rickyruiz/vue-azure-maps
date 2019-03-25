#!/usr/bin/env sh

# abort on errors
set -e

# build
yarn run docs:build

# navigate into the build output directory
cd docs/.vuepress/dist

git init
git add -A
git commit -m 'docs(deploy): 📝 update documentation'

git push -f git@github.com:rickyruiz/vue-azure-maps.git master:gh-pages

cd -