#!/bin/bash
# setup-supporting-apps.sh
# Clones the supporting repositories directly into the parent
# directory (i.e. /home/user), one folder per repo.

set -e

# Resolve the directory where this script lives (i.e. the To-Do-app root)
SCRIPT_DIR="$(cd "$(dirname "${BASH_SOURCE[0]}")" && pwd)"
PARENT_DIR="$(dirname "$SCRIPT_DIR")"
TARGET_DIR="$PARENT_DIR"

REPOS=(
  "https://github.com/Abilash-sync/Deepagent"
  "https://github.com/Abilash-sync/IDE"
)

echo "==> Target directory: $TARGET_DIR"

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