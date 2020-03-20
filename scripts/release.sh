set -e
echo "Enter release version: "
read VERSION

read -p "Releasing v$VERSION - are you sure? (y/n)" -n 1 -r
echo    # (optional) move to a new line
if [[ $REPLY =~ ^[Yy]$ ]]
then
  echo "Releasing v$VERSION ..."
  # yarn run test
  VUE_APP_VERSION=$VERSION yarn run build:lib

  # commit
  git add dist
  git commit -m "build: 📦 bundle v$VERSION"
  yarn version --new-version $VERSION --message "chore(release): 🔖 v$VERSION"

  # changelog
  yarn run changelog
  echo "Please check the git history and the changelog and press enter"
  read OKAY
  git add CHANGELOG.md
  git commit -m "chore(changelog): 📝 v$VERSION"

  # publish
  git push origin refs/tags/v$VERSION
  git push origin master
  yarn publish
fi
