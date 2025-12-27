import express from "express";
import dotenv from "dotenv";
import path from "path";
import fs from "fs";
import cors from "cors";
import session from "express-session";
import passport from "passport";
import connectDB from "./config/db.js";
import configurePassport from "./config/passport.js";

dotenv.config();
connectDB();
configurePassport();

const app = express();
const CLIENT_ORIGIN = process.env.CLIENT_ORIGIN || "http://localhost:5173";
const oauthProviders = {
  google: Boolean(process.env.GOOGLE_CLIENT_ID && process.env.GOOGLE_CLIENT_SECRET),
  facebook: Boolean(
    process.env.FACEBOOK_APP_ID && process.env.FACEBOOK_APP_SECRET
  )
};

app.use(cors({ origin: CLIENT_ORIGIN, credentials: true }));
app.use(express.json());
app.set("trust proxy", 1);
app.use(
  session({
    secret: process.env.SESSION_SECRET || "apofasi-session-secret",
    resave: false,
    saveUninitialized: false,
    cookie: {
      secure: process.env.NODE_ENV === "production",
      sameSite: process.env.NODE_ENV === "production" ? "none" : "lax",
      httpOnly: true,
      maxAge: 1000 * 60 * 60 * 24 * 7
    }
  })
);
app.use(passport.initialize());
app.use(passport.session());

app.get("/auth/status", (req, res) => {
  res.json({
    authenticated: Boolean(req.user),
    providers: oauthProviders,
    user: req.user
      ? {
          id: req.user.id,
          displayName: req.user.displayName,
          email: req.user.email,
          provider: req.user.provider,
          avatar: req.user.avatar
        }
      : null
  });
});

const ensureProviderConfigured = (provider) => (req, res, next) => {
  if (!oauthProviders[provider]) {
    return res
      .status(503)
      .json({ message: `${provider} login is not configured yet.` });
  }

  return next();
};

app.get(
  "/auth/google",
  ensureProviderConfigured("google"),
  passport.authenticate("google", { scope: ["profile", "email"] })
);

app.get(
  "/auth/google/callback",
  ensureProviderConfigured("google"),
  passport.authenticate("google", {
    failureRedirect: `${CLIENT_ORIGIN}/auth/error`
  }),
  (req, res) => {
    res.redirect(`${CLIENT_ORIGIN}/auth/success`);
  }
);

app.get(
  "/auth/facebook",
  ensureProviderConfigured("facebook"),
  passport.authenticate("facebook", { scope: ["email"] })
);

app.get(
  "/auth/facebook/callback",
  ensureProviderConfigured("facebook"),
  passport.authenticate("facebook", {
    failureRedirect: `${CLIENT_ORIGIN}/auth/error`
  }),
  (req, res) => {
    res.redirect(`${CLIENT_ORIGIN}/auth/success`);
  }
);

app.get("/auth/logout", (req, res, next) => {
  req.logout((error) => {
    if (error) return next(error);
    res.json({ message: "Logged out" });
  });
});

const PORT = process.env.PORT || 5000;
const __dirname = path.resolve();
const clientBuildPath = path.join(__dirname, "../client/dist");
const clientIndexPath = path.join(clientBuildPath, "index.html");
const hasClientBuild = fs.existsSync(clientIndexPath);

if (!hasClientBuild) {
  app.get("/", (req, res) => {
    res.send("API running...");
  });
}

if (hasClientBuild) {
  app.use(express.static(clientBuildPath));

  app.get("*", (req, res) => {
    res.sendFile(clientIndexPath);
  });
} else if (process.env.NODE_ENV === "production") {
  console.warn(
    "Client build not found at ../client/dist. Mission and other routes will return 404s."
  );
}

app.listen(PORT, () =>
  console.log(`Server running on port ${PORT}`)
);
