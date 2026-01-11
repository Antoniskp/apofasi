# apofasi

For the moment this application which is live at http://176.126.202.242 is made mostly from ai(chatGPT paid version).
The scope of the app is to educate, inform and help the community express and find better solutions.

Application for news, education and polls.
The idea is creating the core of a super application which will support news, education, polls and collective decision making.

## Local setup overview

Follow these steps to bring up the full stack (database + server + client):

1. **Start MongoDB.** The server expects MongoDB at `mongodb://localhost:27017/apofasi`. Run `mongod` locally with a data directory of your choice or point `MONGO_URI` to a managed instance. Optional: pre-create collections and indexes with `mongosh < server/db/init.mongodb.js`.
2. **Configure the backend.** In `server/`, copy `.env.example` to `.env` and fill in at least `MONGO_URI`, `SESSION_SECRET`, and the OAuth provider keys if you plan to enable social login. Keep `CLIENT_ORIGIN` aligned with the URL you load the frontend from (e.g., `http://localhost:5173`).
3. **Configure the frontend.** In `client/`, create a `.env` file with `VITE_API_BASE_URL=http://localhost:5000` (or your server’s URL). The client will append `/api` automatically, so keep this value as the API origin (no `/api` suffix). The Vite dev server and the production build both read this value to reach the API.
4. **Install dependencies.** Run `npm install` inside both `server/` and `client/`.
5. **Run locally.** Start MongoDB, then `npm run dev` in `server/` to launch the API and `npm run dev` in `client/` for the Vite frontend. For production-style testing, build the client with `npm run build` in `client/` and let the Express server serve `client/dist`.

### Connecting with MongoDB Compass (remote)

If you want to browse the live database from your machine instead of a local Mongo instance, open MongoDB Compass and create a new connection using the same URI the server uses in production. For the deployed host at `176.126.202.242`, the typical connection string is:

```
mongodb://<username>:<password>@176.126.202.242:27017/apofasi?authSource=admin
```

Replace `<username>`/`<password>` with the credentials configured on the server (they mirror the `MONGO_URI` value in `server/.env`). Make sure your IP is allowed through the server firewall/security group before connecting.

## Deploying the client build

Use the `./deploy.sh` helper to compile the Vite client and populate
`client/dist`, which the server serves in production. The script checks for
unresolved merge conflicts before running so you get a clear message instead of
Git errors during deployment.

## Deploying the server build

The node.js service is managed by systemctl.

- Check service status by running the command `sudo systemctl status apofasi.service`
- Edit managed service config with `sudo nano /etc/systemd/system/apofasi.service`

To deploy new code for the server application:

- `cd server`
- `npm i`
- `sudo systemctl restart apofasi.service`

## Nginx reverse proxy (production)

Proxy `/api/` to the Express server and keep SPA routing for everything else. Example:

```nginx
server {
  listen 80;
  server_name apofasi.gr;

  root /var/www/apofasi/client/dist;

  location /api/ {
    proxy_pass http://127.0.0.1:5000;
    proxy_http_version 1.1;
    proxy_set_header Host $host;
    proxy_set_header X-Forwarded-For $proxy_add_x_forwarded_for;
    proxy_set_header X-Forwarded-Proto $scheme;
  }

  location / {
    try_files $uri /index.html;
  }
}
```

## Social login (Google & Facebook)

The backend supports OAuth login with Google and Facebook. Social login is disabled by default and only turns on when you provide
provider keys in the environment. Configure the following environment variables before running the server:

```
MONGO_URI=mongodb://localhost:27017/apofasi
SESSION_SECRET=replace-me
CLIENT_ORIGIN=http://localhost:5173
GOOGLE_CLIENT_ID=your-google-client-id
GOOGLE_CLIENT_SECRET=your-google-client-secret
GOOGLE_CALLBACK_URL=http://localhost:5000/auth/google/callback
FACEBOOK_APP_ID=your-facebook-app-id
FACEBOOK_APP_SECRET=your-facebook-app-secret
FACEBOOK_CALLBACK_URL=http://localhost:5000/auth/facebook/callback
```

On the frontend, set `VITE_API_BASE_URL` to point to your running server (e.g. `http://localhost:5000`) so the login buttons redirect correctly.

For a step-by-step server setup guide (including provider dashboard steps and how to run the server locally), see
[`server/README.md`](server/README.md).

### Sentry.io - monitor issues

1. create an account (free tier) in [sentry.io](https://sentry.io/signup)
2. create a new project - a node js one
3. get the DSN (link) from the sentry.io platform
4. paste it in the server > .env > SENTRY_DSN=

### CORS

Add the ip or domain of the machine serving the application in the CLIENT_ORIGIN env variable.  
For example, when a domain (e.g., apofasi.gr) will be used im the deployment, update the variable in the directory `server > .env`, as such `CLIENT_ORIGIN=http://localhost:5173,http://176.126.202.242,https://apofasi.gr,https:www.apofasi.gr`

### CI/CD - Github Actions - automate deployment

To avoid having to manually connect to the VPS with ssh everytime to deploy new changes, we are utilising a Github Actions Workflow. The config can be found in `.github/workflows/deploy.yml`
In order for this file to run correctly, secret env variables have been added in the github platform.  
These can be found (need to be added) in the repo's  
`settings > secrets and variables > actions > secrets > repository secrets`  
and  
`settings > secrets and variables > actions > variables > repository variables`

The variables under **secrets** are:

- USERNAME : ssh username (e.g., root OR <USERNAME>)
- PASSWORD : ssh password

The variables under **variables** are:

- HOST : define the VPS' IP (e.g., 176.126.202.242)
