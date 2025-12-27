#!/usr/bin/env bash
set -euo pipefail

# Build the frontend and prepare it for the server to serve from client/dist.
# If the repository has unresolved merge conflicts, fail fast with a clear
# message so the user can resolve them before pulling or deploying.

if git rev-parse --is-inside-work-tree >/dev/null 2>&1; then
  if git status --porcelain --unmerged | grep -q .; then
    echo "Unmerged files detected. Resolve merge conflicts before deploying." >&2

    if git rev-parse -q --verify MERGE_HEAD >/dev/null 2>&1; then
      echo "A merge appears to be in progress. You can abort it with:" >&2
      echo "  git merge --abort" >&2
    elif [ -d .git/rebase-apply ] || [ -d .git/rebase-merge ]; then
      echo "A rebase appears to be in progress. You can abort it with:" >&2
      echo "  git rebase --abort" >&2
    fi

    echo "Otherwise, run 'git status' to list files with conflicts, fix them, then run:" >&2
    echo "  git add <file> ..." >&2
    echo "  git commit --no-edit" >&2
    echo "After resolving conflicts, re-run ./deploy_client.sh" >&2
    exit 1
  fi
fi

SCRIPT_DIR=$(cd "$(dirname "${BASH_SOURCE[0]}")" && pwd)
cd "$SCRIPT_DIR/client"

if [ ! -d node_modules ]; then
  npm install
fi

npm run build
