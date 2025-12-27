#!/usr/bin/env bash
set -euo pipefail

echo "== Apofasi deploy started =="

# Ensure we are in a git repo
git rev-parse --is-inside-work-tree >/dev/null 2>&1 || {
  echo "ERROR: Not inside a git repository"
  exit 1
}

# Fail if there are unmerged files
if git diff --name-only --diff-filter=U | grep -q .; then
  echo "ERROR: Unmerged files detected. Resolve conflicts before deploying."
  exit 1
fi

# Fail if there are uncommitted changes that would block a pull
if [[ -n "$(git status --porcelain)" ]]; then
  echo "ERROR: Working tree is not clean. Commit, stash, or discard changes before deploying."
  git status --short
  exit 1
fi

# Sync with remote without creating merge commits
echo "== Syncing with origin/main =="
if ! git pull --ff-only origin main; then
  echo "ERROR: Unable to fast-forward to origin/main. Please resolve the issue (rebase or merge) and retry."
  exit 1
fi

# Build client
echo "== Building client =="
cd client
npm ci
npm run build
cd ..

# Deploy build to nginx root
echo "== Deploying client build to nginx =="
sudo rsync -a --delete client/dist/ /var/www/apofasi/

# Reload nginx
echo "== Reloading nginx =="
sudo systemctl reload nginx

# Final verification
echo "== Deployment finished =="
echo "Deployed commit:"
git rev-parse --short HEAD
ls -la /var/www/apofasi/index.html
