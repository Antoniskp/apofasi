# Troubleshooting Guide

Common issues and solutions for the Apofasi application.

## Table of Contents
- [Installation Issues](#installation-issues)
- [Environment Variables](#environment-variables)
- [Database Issues](#database-issues)
- [Authentication Issues](#authentication-issues)
- [Build Issues](#build-issues)
- [Runtime Errors](#runtime-errors)

---

## Installation Issues

### npm install fails

**Problem:** Dependency installation fails with errors.

**Solutions:**
1. Clear npm cache:
   ```bash
   npm cache clean --force
   ```

2. Delete `node_modules` and `package-lock.json`:
   ```bash
   rm -rf node_modules package-lock.json
   npm install
   ```

3. Check Node.js version:
   ```bash
   node --version  # Should be v16 or higher
   ```

4. Try with legacy peer deps:
   ```bash
   npm install --legacy-peer-deps
   ```

---

## Environment Variables

### Missing .env file

**Problem:** Application crashes with "Cannot read property of undefined".

**Solution:**
1. Create `.env` files from examples:
   ```bash
   # Server
   cp server/.env.example server/.env
   
   # Client
   cp client/.env.example client/.env
   ```

2. Fill in required values in `server/.env`:
   - `MONGO_URI`
   - `SESSION_SECRET`

### Environment variables not loading

**Problem:** Environment variables are undefined at runtime.

**Solutions:**
1. Check file location:
   - Server: `/server/.env`
   - Client: `/client/.env`

2. Restart development server after changes

3. For client variables, ensure they start with `VITE_`:
   ```
   VITE_API_BASE_URL=http://localhost:5000
   ```

4. Test environment loading:
   ```bash
   cd server
   npm run check-env
   ```

---

## Database Issues

### Cannot connect to MongoDB

**Problem:** "MongoServerError: Authentication failed" or "ECONNREFUSED".

**Solutions:**

1. **MongoDB not running**:
   ```bash
   # Start MongoDB
   mongod
   
   # Or if using service
   sudo systemctl start mongod
   ```

2. **Wrong connection string**:
   - Check `MONGO_URI` in `server/.env`
   - Format: `mongodb://localhost:27017/apofasi`
   - With auth: `mongodb://username:password@localhost:27017/apofasi?authSource=admin`

3. **Port already in use**:
   ```bash
   # Check what's using port 27017
   lsof -i :27017
   
   # Or use different port
   MONGO_URI=mongodb://localhost:27018/apofasi
   ```

4. **Firewall blocking connection**:
   ```bash
   # Allow MongoDB port
   sudo ufw allow 27017
   ```

### Database migration issues

**Problem:** Old data structure causing errors.

**Solution:**
1. Backup database:
   ```bash
   mongodump --db apofasi --out backup/
   ```

2. Drop and recreate (development only):
   ```bash
   mongosh
   > use apofasi
   > db.dropDatabase()
   > exit
   ```

3. Restart application to seed default data

---

## Authentication Issues

### Session not persisting

**Problem:** User gets logged out on page refresh.

**Solutions:**

1. **Check session configuration**:
   - Ensure `SESSION_SECRET` is set in `server/.env`
   - Check cookie settings in browser (should allow cookies)

2. **HTTP vs HTTPS cookie issues**:
   - **Symptom**: Cookies rejected in production but work in development
   - **Cause**: `SameSite=None` requires `Secure=true` (HTTPS)
   - **Solution for HTTP deployments**: Add to `server/.env`:
     ```bash
     SESSION_SECURE=false
     SESSION_SAMESITE=lax
     ```
   - **Solution for HTTPS**: Ensure reverse proxy sets `X-Forwarded-Proto: https`

3. **CORS issues**:
   - Ensure `CLIENT_ORIGIN` matches your client URL exactly
   - Check that credentials are enabled in fetch requests (`credentials: 'include'`)
   - For multiple origins, separate with commas: `http://localhost:5173,https://app.example.com`

4. **Proxy issues** (production):
   - Ensure `trust proxy` is enabled in server.js (already configured)
   - Check nginx/reverse proxy configuration
   - Verify `X-Forwarded-Proto` header is set correctly

5. **Browser cookie restrictions**:
   - Check browser console for cookie warnings
   - Ensure third-party cookies are not blocked (needed for cross-origin)
   - Test in incognito mode to rule out extension interference

### OAuth login not working

**Problem:** OAuth redirect fails or shows error.

**Solutions:**

1. **Provider not configured**:
   - Check environment variables are set:
     - Google: `GOOGLE_CLIENT_ID`, `GOOGLE_CLIENT_SECRET`
     - Facebook: `FACEBOOK_APP_ID`, `FACEBOOK_APP_SECRET`

2. **Redirect URL mismatch**:
   - Update callback URL in OAuth provider settings
   - Must match exactly: `http://localhost:5000/auth/google/callback`

3. **Development vs Production**:
   - Use different OAuth apps for dev and prod
   - Update `GOOGLE_CALLBACK_URL` for environment

---

## Build Issues

### Client build fails

**Problem:** `npm run build` fails in client directory.

**Solutions:**

1. **Missing environment variable**:
   ```bash
   # Create client/.env with:
   VITE_API_BASE_URL=http://localhost:5000
   ```

2. **ESLint errors**:
   ```bash
   # Fix automatically
   npm run lint:fix
   
   # Or disable during build (not recommended)
   VITE_DISABLE_ESLINT=true npm run build
   ```

3. **Out of memory**:
   ```bash
   # Increase Node memory
   NODE_OPTIONS=--max-old-space-size=4096 npm run build
   ```

### Server won't start

**Problem:** Server crashes on startup.

**Solutions:**

1. **Port already in use**:
   ```bash
   # Find process using port 5000
   lsof -i :5000
   
   # Kill process
   kill -9 <PID>
   
   # Or use different port
   PORT=5001 npm run dev
   ```

2. **Missing dependencies**:
   ```bash
   npm install
   ```

3. **Syntax errors**:
   - Check server logs for specific error
   - Run linter: `npm run lint`

---

## Runtime Errors

### CORS errors in browser

**Problem:** "Access-Control-Allow-Origin" errors.

**Solutions:**

1. **Check CLIENT_ORIGIN**:
   ```bash
   # In server/.env
   CLIENT_ORIGIN=http://localhost:5173,http://localhost:3000
   ```

2. **Credentials not sent**:
   - Ensure fetch requests include `credentials: 'include'`

3. **Multiple origins**:
   - Separate multiple origins with commas
   - No spaces between origins

### API requests return 404

**Problem:** All API calls return "Not found".

**Solutions:**

1. **Wrong API URL**:
   - Check `VITE_API_BASE_URL` in `client/.env`
   - Should be `http://localhost:5000` (no `/api` suffix)

2. **Server not running**:
   ```bash
   cd server
   npm run dev
   ```

3. **Nginx misconfiguration** (production):
   - Check `/api/` proxy_pass in nginx config

### Unexpected token errors

**Problem:** "Unexpected token" in JavaScript.

**Solutions:**

1. **Node version too old**:
   ```bash
   node --version  # Should be v16+
   nvm install 18
   nvm use 18
   ```

2. **Missing babel/transpilation**:
   - Ensure using ES modules (type: "module" in package.json)

---

## Performance Issues

### Slow API responses

**Solutions:**

1. **Add database indexes**:
   - Already defined in models, ensure they're created
   - Check with: `db.collection.getIndexes()`

2. **Enable MongoDB profiling**:
   ```bash
   mongosh
   > db.setProfilingLevel(2)
   > db.system.profile.find().sort({ts:-1}).limit(5)
   ```

3. **Check server resources**:
   ```bash
   htop  # CPU and memory usage
   ```

### Client app is slow

**Solutions:**

1. **Development mode**:
   - Use `npm run build` + `npm run preview` for faster testing

2. **Large bundle size**:
   - Check bundle size: `npm run build -- --report`
   - Consider code splitting

---

## Deployment Issues

### deploy.sh fails

**Problem:** Deployment script errors.

**Solutions:**

1. **Permission denied**:
   ```bash
   chmod +x deploy.sh
   ```

2. **Git conflicts**:
   - Script does `git reset --hard origin/main`
   - Ensure no local changes on server

3. **Build fails**:
   - Check Node version on server
   - Ensure all dependencies installed

### GitHub Actions fails

**Problem:** CI/CD workflow fails.

**Solutions:**

1. **Check workflow file**:
   - Should use `ubuntu-latest`
   - Check secrets are set in GitHub

2. **SSH connection fails**:
   - Verify `HOST`, `USERNAME`, `PASSWORD` in GitHub secrets
   - Test SSH connection manually

3. **Check logs**:
   - Go to Actions tab in GitHub
   - Click on failed workflow
   - Review step-by-step logs

---

## Getting Help

If you're still stuck:

1. **Check logs**:
   - Server: Console output
   - Client: Browser console (F12)
   - MongoDB: `/var/log/mongodb/mongod.log`

2. **Enable debug mode**:
   ```bash
   # Server
   REQUEST_LOGGING=true npm run dev
   
   # MongoDB
   MONGO_URI=mongodb://localhost:27017/apofasi?debug=true
   ```

3. **Search GitHub issues**:
   - Someone may have had the same problem

4. **Create new issue**:
   - Include error messages
   - Include environment info
   - Include steps to reproduce

---

## Useful Commands

```bash
# Check if ports are in use
lsof -i :5000  # Server
lsof -i :5173  # Client
lsof -i :27017 # MongoDB

# View logs
tail -f /var/log/mongodb/mongod.log  # MongoDB logs
pm2 logs apofasi  # If using PM2

# Test API endpoint
curl http://localhost:5000/api/news

# Check MongoDB connection
mongosh --eval "db.adminCommand('ping')"

# Clear npm cache completely
npm cache clean --force
rm -rf ~/.npm

# Reinstall everything from scratch
rm -rf node_modules package-lock.json
npm install
```

---

## Prevention Tips

1. **Always create `.env` from `.env.example`**
2. **Run linters before committing**: `npm run lint`
3. **Test locally before deploying**
4. **Keep dependencies updated**: `npm outdated`
5. **Regular backups of database**
6. **Use version control properly** (meaningful commits)
7. **Read error messages carefully** (they usually tell you what's wrong)
