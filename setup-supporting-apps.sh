#!/bin/bash
# setup-supporting-apps.sh
# Creates a "supporting-apps" folder inside this To-Do-app directory
# and clones the three supporting repositories into it.

set -e

# Resolve the directory where this script lives (i.e. the To-Do-app root)
SCRIPT_DIR="$(cd "$(dirname "${BASH_SOURCE[0]}")" && pwd)"
TARGET_DIR="$SCRIPT_DIR/supporting-apps"

REPOS=(
  "https://github.com/anushaviswanathan2002/Counter-app.git"
  "https://github.com/anushaviswanathan2002/Drawing-App.git"
  "https://github.com/anushaviswanathan2002/Memory-app.git"
)

echo "==> Target directory: $TARGET_DIR"

if [ -d "$TARGET_DIR" ]; then
  echo "==> '$TARGET_DIR' already exists. Skipping creation."
else
  mkdir -p "$TARGET_DIR"
  echo "==> Created '$TARGET_DIR'."
fi

for REPO in "${REPOS[@]}"; do
  REPO_NAME="$(basename "$REPO" .git)"
  DEST="$TARGET_DIR/$REPO_NAME"

  if [ -d "$DEST" ]; then
    echo "==> Skipping '$REPO_NAME' (already exists at $DEST)."
    continue
  fi

  echo "==> Cloning $REPO into $DEST ..."
  git clone "$REPO" "$DEST"
done

echo "==> Done. Supporting apps are available in $TARGET_DIR."
ls -la "$TARGET_DIR"