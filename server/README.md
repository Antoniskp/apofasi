# Server setup for social login

This backend is an Express + Passport server that issues session cookies after Google, Facebook, or GitHub OAuth.
Follow these steps to get it running locally and configure the providers correctly.

## Database bootstrap

The server targets MongoDB at `mongodb://localhost:27017/apofasi` by default (configurable via `MONGO_URI`). Start a local `mongod` with that URI or point the variable to your deployment. If you want MongoDB collections and indexes pre-created, run the provided script:

```bash
mongosh < db/init.mongodb.js
```

The script creates the `users`, `polls`, and `news` collections and applies the
unique/sparse indexes expected by the models.

> File checklist: `server/db/init.mongodb.js` seeds collections and indexes; `.env` stores credentials and URLs; `client/dist` is served in production, so keep it in place when running `npm start`.

Need to add a local user quickly? Use the seed helper (prompts for email and password):

```bash
# from the repo root
npm run seed:user
# or, from this directory
npm --prefix server run seed:user
```

It hashes the provided password with the same algorithm used by the server and skips creation when the email already exists.

Need a quick reference for the database? See [`DB_SCHEMA.md`](./DB_SCHEMA.md).

## 1) Install dependencies and start MongoDB

```bash
cd server
npm install
# make sure MongoDB is running and reachable at the URI you plan to use
```

## 2) Create a `.env` file

Copy the provided `.env.example` file and fill in the blanks:

```bash
cp .env.example .env
```

The example already contains sensible defaults:
- Mongo runs locally at `mongodb://localhost:27017/apofasi`.
- The client is expected at `http://localhost:5173`.
- OAuth callbacks point to `http://localhost:5000/auth/{provider}/callback`.
- `PORT=5000` and `NODE_ENV=development` are set for local usage.

Key fields you must set:
- `MONGO_URI`: connection string for MongoDB.
- `SESSION_SECRET`: long random string for signing the session cookie.
- `SESSION_NAME` (optional): override the default `apofasi.sid` session cookie name.
- `SESSION_MAX_AGE_DAYS` (optional): customize the cookie/session lifetime (defaults to 7 days).
- `SESSION_SECURE` (optional): override session cookie secure flag (`true` or `false`). If not set, defaults to `true` in production (assumes HTTPS), `false` in development. Invalid values will cause the server to fail at startup.
- `SESSION_SAMESITE` (optional): override session cookie SameSite attribute (`none`, `lax`, or `strict`). If not set, defaults to `none` in production (with `secure=true`), `lax` in development. **Important**: `SameSite=None` requires `Secure=true` (HTTPS). For HTTP-only deployments, explicitly set `SESSION_SECURE=false` and `SESSION_SAMESITE=lax`. Invalid values will cause the server to fail at startup.
- `CLIENT_ORIGIN`: the base URL of the frontend that will initiate OAuth and receive redirects.
- `GOOGLE_CLIENT_ID` / `GOOGLE_CLIENT_SECRET`: from the Google Cloud OAuth client.
- `FACEBOOK_APP_ID` / `FACEBOOK_APP_SECRET`: from your Facebook app.
- `GITHUB_CLIENT_ID` / `GITHUB_CLIENT_SECRET`: from your GitHub OAuth app.
- Callback URLs must match what you register with the providers; the defaults assume a local server on port 5000.

Sessions are persisted in MongoDB via `connect-mongo`, so make sure the `MONGO_URI` points to a writable database.

> Tip: If you leave the provider credentials empty, the server keeps social login disabled and responds with HTTP 503 for those
> routes until keys are added. This lets you ship the rest of the stack without enabling OAuth yet.

## 3) Configure OAuth providers

### Google
1. In the Google Cloud console, create an OAuth 2.0 Client ID (type: Web application).
2. Add the following Authorized redirect URI (adjust port if needed):
   - `http://localhost:5000/auth/google/callback`
3. Enable the **People API** if your project requires it for profile data.

### Facebook
1. In the Meta for Developers dashboard, create an app and add the **Facebook Login** product.
2. Under **Valid OAuth Redirect URIs**, add:
   - `http://localhost:5000/auth/facebook/callback`
3. Make sure **email** is included in the permissions; the server already requests it.

### GitHub
1. In GitHub Developer Settings, create a new OAuth App.
2. Set the Authorization callback URL to:
   - `http://localhost:5000/auth/github/callback`
3. Keep the application URL aligned with `CLIENT_ORIGIN`.

## 4) Run the server

Use the provided scripts:
```bash
# from the server directory
npm run dev   # watches for changes (development)
npm start     # production-style start
```

The server will expose these endpoints:
- `GET /auth/google` → starts Google OAuth.
- `GET /auth/facebook` → starts Facebook OAuth.
- `GET /auth/github` → starts GitHub OAuth.
- `GET /auth/status` → returns whether the user is authenticated and the basic profile data.
- `GET /auth/logout` → clears the session.

### Debugging auth requests

- Set `REQUEST_LOGGING=true` in your `.env` to print each auth request method, path, origin, and a redacted body in the server
  logs. This helps confirm whether the client is calling `/auth/*` or `/api/auth/*` and what data reaches the backend.
- If your deployment sits behind a proxy that filters HTTP verbs, verify that `OPTIONS` requests to `/auth/register` or
  `/api/auth/register` are allowed. The server now responds to explicit preflight checks on those paths so you can test with a
  simple `curl -i -X OPTIONS https://<your-host>/api/auth/register`.

## 5) Frontend coordination

Set `VITE_API_BASE_URL` in the client to point to this server (e.g., `http://localhost:5000`) and make sure `CLIENT_ORIGIN` matches the URL the browser uses to load the frontend.

## 6) Session cookie configuration

The server automatically configures session cookies based on your deployment environment:

**Default behavior:**
- **Development** (`NODE_ENV=development` or not set): Uses `secure=false` and `sameSite=lax` for HTTP compatibility.
- **Production** (`NODE_ENV=production`): Uses `secure=true` and `sameSite=none`, assuming HTTPS is configured.

**HTTP-only deployments in production:**

If you're running the app in production over HTTP (without SSL/TLS), browsers will reject cookies with `SameSite=None` because that requires `Secure=true`. To fix this, explicitly configure the session cookies in your `.env`:

```bash
NODE_ENV=production
SESSION_SECURE=false
SESSION_SAMESITE=lax
```

**HTTPS deployments:**

When running behind a reverse proxy with HTTPS (recommended for production), the defaults work correctly. Ensure your nginx or other reverse proxy sets the `X-Forwarded-Proto` header and that the Express app trusts the proxy (already configured with `app.set('trust proxy', 1)`).

**Cross-origin cookies:**

If your frontend and backend are on different domains (e.g., `app.example.com` and `api.example.com`), you must use HTTPS with `SESSION_SECURE=true` and `SESSION_SAMESITE=none`. Browsers do not allow cross-site cookies over HTTP.
