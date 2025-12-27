#!/usr/bin/env bash
set -euo pipefail

echo "== Apofasi deploy =="

# 1) Always sync server to GitHub main (server must never diverge)
echo "== Syncing with origin/main =="
git fetch origin
git reset --hard origin/main

# 2) Build client (works with or without package-lock.json)
echo "== Building client =="
cd client

if [ -f package-lock.json ]; then
  npm ci
else
  npm install
fi

npm run build
cd ..

# 3) Deploy build to NGINX root
echo "== Deploying client build to nginx root =="
sudo rsync -a --delete client/dist/ /var/www/apofasi/

# 4) Reload NGINX
echo "== Reloading nginx =="
sudo systemctl reload nginx

# 5) Verification
echo "== Deployment finished =="
echo "Deployed commit: $(git rev-parse --short HEAD)"
ls -la /var/www/apofasi/index.html
