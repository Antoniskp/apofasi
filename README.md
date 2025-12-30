# apofasi
For the moment this application which is live at http://176.126.202.242 is made entirely from ai(chatGPT paid version) with the instructions of a developer. In hopes that it becomes more of a community project. The scope of the app is to educate, inform  and help the community express and find better solutions.


Application for news, education and polls.
The idea is creating the core of a super application which will support news, education, polls and collective decision making.

## Local setup overview

Follow these steps to bring up the full stack (database + server + client):

1. **Start MongoDB.** The server expects MongoDB at `mongodb://localhost:27017/apofasi`. Run `mongod` locally with a data directory of your choice or point `MONGO_URI` to a managed instance. Optional: pre-create collections and indexes with `mongosh < server/db/init.mongodb.js`.
2. **Configure the backend.** In `server/`, copy `.env.example` to `.env` and fill in at least `MONGO_URI`, `SESSION_SECRET`, and the OAuth provider keys if you plan to enable social login. Keep `CLIENT_ORIGIN` aligned with the URL you load the frontend from (e.g., `http://localhost:5173`).
3. **Configure the frontend.** In `client/`, create a `.env` file with `VITE_API_BASE_URL=http://localhost:5000` (or your server’s URL). The Vite dev server and the production build both read this value to reach the API.
4. **Install dependencies.** Run `npm install` inside both `server/` and `client/`.
5. **Run locally.** Start MongoDB, then `npm run dev` in `server/` to launch the API and `npm run dev` in `client/` for the Vite frontend. For production-style testing, build the client with `npm run build` in `client/` and let the Express server serve `client/dist`.

## Deploying the client build

Use the `./deploy_client.sh` helper to compile the Vite client and populate
`client/dist`, which the server serves in production. The script checks for
unresolved merge conflicts before running so you get a clear message instead of
Git errors during deployment.

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