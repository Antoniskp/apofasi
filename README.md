# apofasi
Θέλουμε να φτιάξουμε μια εφαρμογή άμεσης δημοκρατίας τώρα που το είπε και ο φειδίας.
Εδώ μέσω κοινότητας είναι εύκολο να αναπτυχθεί και να ελεγθεί η αξιοπιστία του κώδικα.
Αν από τους 10 οι 6 θέλουν να σκοτώνονται θα σκοτώνονται και οι 10 μέχρι να μείνουν 6-7.

Application for news, education and polls.
The idea is creating the core of a super application which will support news, education, polls and collective decision making.

## Deploying the client build

Use the `./deploy_client.sh` helper to compile the Vite client and populate
`client/dist`, which the server serves in production. The script checks for
unresolved merge conflicts before running so you get a clear message instead of
Git errors during deployment. It also detects in-progress merges or rebases and
points you to the commands needed to resolve or abort them prior to deploying.

If Git reports conflicts in this file or the script, do not leave the conflict
markers (`<<<<<<<`, `=======`, `>>>>>>>`) in place or delete both versions of
the text. Pick the wording you want (or combine both sides), remove the marker
lines, and save the final text. For the deploy helper description above, keep a
single sentence that mentions both merge-conflict checks and merge/rebase
detection.

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
