#!/usr/bin/env bash
set -e

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

# Always sync server to GitHub main
echo "== Syncing with origin/main =="
git fetch origin
git reset --hard origin/main

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
