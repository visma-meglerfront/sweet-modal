#!/bin/bash
# Change branch
git checkout gh-pages

# Clear branch
find . -not -name 'examples' \
	   -not -name '.gitignore' \
	   -not -name '.git' \
	   -not -name 'build-page.sh' \
	   -not -name . \
	   -not -name .. \
	   -maxdepth 1 \
	   -exec rm -rf {} \;

# Copy example page
cp -r examples/* .

# Commit
git add -u
git reset -- examples
git commit -m "newest build"
git push origin gh-pages

# Remove examples folder
rm -rf examples

# Go back
git checkout master