set -e
echo "Enter release version: "
read VERSION

read -p "Releasing $VERSION - are you sure? (y/n)" -n 1 -r
echo    # (optional) move to a new line
if [[ $REPLY =~ ^[Yy]$ ]]
then
  echo "Releasing $VERSION ..."
  # yarn run test
  VERSION=$VERSION yarn run build:lib

  # commit
  git add -A
  git commit -m "chore(build): 🔖 $VERSION"
  yarn version --new-version $VERSION --message "chore(release): 🔖 $VERSION"

  # publish
  git push origin refs/tags/v$VERSION
  git push origin master
  yarn publish
fi