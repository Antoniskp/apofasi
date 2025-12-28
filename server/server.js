import express from "express";
import dotenv from "dotenv";
import path from "path";
import fs from "fs";
import { fileURLToPath } from "url";
import crypto from "crypto";
import cors from "cors";
import session from "express-session";
import passport from "passport";
import connectDB from "./config/db.js";
import configurePassport from "./config/passport.js";
import User from "./models/User.js";

dotenv.config();
connectDB();
configurePassport();

const app = express();
const authRouter = express.Router();
const CLIENT_ORIGIN = process.env.CLIENT_ORIGIN || "http://localhost:5173";
const allowedOrigins = CLIENT_ORIGIN.split(",").map((origin) => origin.trim()).filter(Boolean);
const corsOptions = {
  origin: (origin, callback) => {
    if (!origin || allowedOrigins.includes(origin)) {
      return callback(null, true);
    }
    return callback(new Error("Not allowed by CORS"));
  },
  credentials: true
};
const shouldLogRequests = process.env.REQUEST_LOGGING === "true";
const oauthProviders = {
  google: Boolean(process.env.GOOGLE_CLIENT_ID && process.env.GOOGLE_CLIENT_SECRET),
  facebook: Boolean(process.env.FACEBOOK_APP_ID && process.env.FACEBOOK_APP_SECRET)
};

const sanitizeUser = (user) =>
  user
    ? {
        id: user.id,
        displayName: user.displayName,
        email: user.email,
        provider: user.provider,
        avatar: user.avatar,
        username: user.username
      }
    : null;

const hashPassword = (password) => {
  const salt = crypto.randomBytes(16).toString("hex");
  const derivedKey = crypto.scryptSync(password, salt, 64).toString("hex");
  return `${salt}:${derivedKey}`;
};

const verifyPassword = (password, storedValue) => {
  const [salt, key] = storedValue.split(":");
  if (!salt || !key) return false;
  const derivedKey = crypto.scryptSync(password, salt, 64);
  try {
    return crypto.timingSafeEqual(Buffer.from(key, "hex"), derivedKey);
  } catch {
    return false;
  }
};

app.use(cors(corsOptions));
app.options("*", cors(corsOptions));
app.options("/auth/*", cors(corsOptions));
app.options("/api/auth/*", cors(corsOptions));
app.use(express.json());

if (shouldLogRequests) {
  app.use((req, res, next) => {
    const safeBody =
      req.method !== "GET" && req.body
        ? {
            ...req.body,
            password: req.body.password ? "<redacted>" : undefined
          }
        : undefined;

    console.log(
      `[auth-debug] ${req.method} ${req.originalUrl} (origin: ${req.headers.origin || "n/a"})`,
      safeBody ? { body: safeBody } : {}
    );

    next();
  });
}
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

authRouter.get("/status", (req, res) => {
  res.json({
    authenticated: Boolean(req.user),
    providers: oauthProviders,
    user: sanitizeUser(req.user)
  });
});

const ensureProviderConfigured = (provider) => (req, res, next) => {
  if (!oauthProviders[provider]) {
    return res.status(503).json({ message: `${provider} login is not configured yet.` });
  }
  return next();
};

const ensureAuthenticated = (req, res, next) => {
  if (!req.user) {
    return res.status(401).json({ message: "Απαιτείται σύνδεση." });
  }
  return next();
};

authRouter.post("/register", async (req, res) => {
  const { email, password, displayName } = req.body || {};

  if (!email || !password) {
    return res.status(400).json({ message: "Απαιτούνται email και κωδικός." });
  }

  const normalizedEmail = String(email).toLowerCase().trim();
  const trimmedName = displayName?.trim();

  if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(normalizedEmail)) {
    return res.status(400).json({ message: "Μη έγκυρο email." });
  }

  if (String(password).length < 8) {
    return res.status(400).json({ message: "Ο κωδικός πρέπει να έχει τουλάχιστον 8 χαρακτήρες." });
  }

  try {
    const existingUser = await User.findOne({ email: normalizedEmail });
    if (existingUser) {
      return res.status(409).json({ message: "Το email χρησιμοποιείται ήδη." });
    }

    const newUser = await User.create({
      provider: "local",
      email: normalizedEmail,
      password: hashPassword(password),
      displayName: trimmedName || normalizedEmail.split("@")[0]
    });

    req.login(newUser, (error) => {
      if (error) {
        return res.status(500).json({ message: "Η δημιουργία συνεδρίας απέτυχε." });
      }
      return res.status(201).json({ user: sanitizeUser(newUser) });
    });
  } catch (error) {
    return res.status(500).json({ message: "Κάτι πήγε στραβά. Προσπαθήστε ξανά." });
  }
});

authRouter.post("/login", async (req, res) => {
  const { email, password } = req.body || {};

  if (!email || !password) {
    return res.status(400).json({ message: "Απαιτούνται email και κωδικός." });
  }

  try {
    const normalizedEmail = String(email).toLowerCase().trim();
    const user = await User.findOne({ email: normalizedEmail });

    if (!user || !user.password) {
      return res.status(401).json({ message: "Λανθασμένα στοιχεία σύνδεσης." });
    }

    if (!verifyPassword(password, user.password)) {
      return res.status(401).json({ message: "Λανθασμένα στοιχεία σύνδεσης." });
    }

    req.login(user, (error) => {
      if (error) {
        return res.status(500).json({ message: "Η δημιουργία συνεδρίας απέτυχε." });
      }
      return res.json({ user: sanitizeUser(user) });
    });
  } catch (error) {
    return res.status(500).json({ message: "Κάτι πήγε στραβά. Προσπαθήστε ξανά." });
  }
});

authRouter.get("/profile", ensureAuthenticated, (req, res) => {
  res.json({ user: sanitizeUser(req.user) });
});

authRouter.get(
  "/google",
  ensureProviderConfigured("google"),
  passport.authenticate("google", { scope: ["profile", "email"] })
);

authRouter.get(
  "/google/callback",
  ensureProviderConfigured("google"),
  passport.authenticate("google", {
    failureRedirect: `${CLIENT_ORIGIN}/auth/error`
  }),
  (req, res) => {
    res.redirect(`${CLIENT_ORIGIN}/auth/success`);
  }
);

authRouter.get(
  "/facebook",
  ensureProviderConfigured("facebook"),
  passport.authenticate("facebook", { scope: ["email"] })
);

authRouter.get(
  "/facebook/callback",
  ensureProviderConfigured("facebook"),
  passport.authenticate("facebook", {
    failureRedirect: `${CLIENT_ORIGIN}/auth/error`
  }),
  (req, res) => {
    res.redirect(`${CLIENT_ORIGIN}/auth/success`);
  }
);

authRouter.get("/logout", (req, res, next) => {
  req.logout((error) => {
    if (error) return next(error);
    res.json({ message: "Logged out" });
  });
});

app.use("/auth", authRouter);
app.use("/api/auth", authRouter);

const PORT = process.env.PORT || 5000;

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

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
    `Client build not found at ${clientBuildPath}. Mission and other routes will return 404s.`
  );
}

app.listen(PORT, () => console.log(`Server running on port ${PORT}`));
