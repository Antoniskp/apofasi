#!/usr/bin/env bash
set -euo pipefail

# Build the frontend and prepare it for the server to serve from client/dist.
# If the repository has unresolved merge conflicts, fail fast with a clear
# message so the user can resolve them before pulling or deploying.

if git rev-parse --is-inside-work-tree >/dev/null 2>&1; then
  if git status --porcelain --unmerged | grep -q .; then
    echo "Unmerged files detected. Resolve merge conflicts before deploying." >&2
    echo "Run 'git status' to see the files with conflicts, fix them, then run:" >&2
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
