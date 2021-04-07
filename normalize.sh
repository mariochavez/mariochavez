echo "Removing old static"
rm -fr ./docs/static

echo "Moving new static"
mv ./docs/_bridgetown/static ./docs

echo "Update static path in HTMLs"
find docs/ -name '*.html' -exec sed -ie 's/_bridgetown\///' {} \;

echo "Clean up"
rm -fr ./docs/_bridgetown;
find docs/ -name '*.htmle' -exec rm {} \;
