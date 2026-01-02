import * as Sentry from "@sentry/node";
import { nodeProfilingIntegration } from "@sentry/profiling-node";
import cors from "cors";
import crypto from "crypto";
import dotenv from "dotenv";
import express from "express";
import session from "express-session";
import fs from "fs";
import mongoose from "mongoose";
import MongoStore from "connect-mongo";
import passport from "passport";
import path from "path";
import { fileURLToPath } from "url";
import connectDB from "./config/db.js";
import configurePassport from "./config/passport.js";
import News from "./models/News.js";
import User from "./models/User.js";
import { CITIES_BY_REGION, REGION_NAMES } from "../shared/locations.js";

dotenv.config();
connectDB();
configurePassport();

// Sentry.io - used for error tracking
Sentry.init({
  dsn: process.env.SENTRY_DSN, // You get this from your Sentry project settings
  integrations: [nodeProfilingIntegration()],
  // Performance Monitoring
  tracesSampleRate: 1.0, // Capture 100% of transactions in dev; lower this in production
  profilesSampleRate: 1.0,
  sendDefaultPii: true,
  // debug: true, // log in the terminal console sentry service logs
});

const app = express();
// The Sentry request handler must be the first middleware on the app
Sentry.setupExpressErrorHandler(app);
const authRouter = express.Router();
const CLIENT_ORIGIN = process.env.CLIENT_ORIGIN || "http://localhost:5173";
const sessionMaxAgeDays = Number(process.env.SESSION_MAX_AGE_DAYS);
const sessionMaxAgeMs =
  Number.isFinite(sessionMaxAgeDays) && sessionMaxAgeDays > 0
    ? sessionMaxAgeDays * 24 * 60 * 60 * 1000
    : 7 * 24 * 60 * 60 * 1000;
const sessionStore = MongoStore.create({
  mongoUrl: process.env.MONGO_URI,
  collectionName: "sessions",
  ttl: sessionMaxAgeMs / 1000,
  touchAfter: 24 * 3600,
});
const allowedOrigins = CLIENT_ORIGIN.split(",")
  .map((origin) => origin.trim())
  .filter(Boolean);
const corsOptions = {
  origin: (origin, callback) => {
    if (!origin || allowedOrigins.includes(origin)) {
      return callback(null, true);
    }
    return callback(new Error("Not allowed by CORS"));
  },
  credentials: true,
};
const shouldLogRequests = process.env.REQUEST_LOGGING === "true";
const oauthProviders = {
  google: Boolean(process.env.GOOGLE_CLIENT_ID && process.env.GOOGLE_CLIENT_SECRET),
  facebook: Boolean(process.env.FACEBOOK_APP_ID && process.env.FACEBOOK_APP_SECRET),
};

const sanitizeUser = (user) =>
  user
    ? {
        id: user.id,
        displayName: user.displayName,
        firstName: user.firstName,
        lastName: user.lastName,
        email: user.email,
        provider: user.provider,
        avatar: user.avatar,
        role: user.role,
        username: user.username,
        mobile: user.mobile,
        country: user.country,
        occupation: user.occupation,
        region: user.region,
        cityOrVillage: user.cityOrVillage,
        createdAt: user.createdAt,
      }
    : null;

const escapeRegex = (value = "") => {
  const pattern = /[.*+?^${}()|[\]\\]/g;
  return value.replace(pattern, "\\$&");
};

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
            password: req.body.password ? "<redacted>" : undefined,
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
    name: process.env.SESSION_NAME || "apofasi.sid",
    secret: process.env.SESSION_SECRET || "apofasi-session-secret",
    resave: false,
    saveUninitialized: false,
    proxy: true,
    store: sessionStore,
    cookie: {
      secure: process.env.NODE_ENV === "production",
      sameSite: process.env.NODE_ENV === "production" ? "none" : "lax",
      httpOnly: true,
      maxAge: sessionMaxAgeMs,
    },
  })
);
app.use(passport.initialize());
app.use(passport.session());

authRouter.get("/status", (req, res) => {
  res.json({
    authenticated: Boolean(req.user),
    providers: oauthProviders,
    user: sanitizeUser(req.user),
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

const ensureRole = (...roles) => (req, res, next) => {
  if (!req.user) {
    return res.status(401).json({ message: "Απαιτείται σύνδεση." });
  }

  if (!roles.includes(req.user.role)) {
    return res.status(403).json({ message: "Δεν έχετε δικαιώματα για αυτή την ενέργεια." });
  }

  return next();
};

const newsRouter = express.Router();

newsRouter.use(ensureAuthenticated);

newsRouter.post("/", ensureRole("reporter", "admin"), async (req, res) => {
  const { title, content } = req.body || {};
  const trimmedTitle = title?.trim();
  const trimmedContent = content?.trim();

  if (!trimmedTitle || !trimmedContent) {
    return res.status(400).json({ message: "Απαιτούνται τίτλος και περιεχόμενο." });
  }

  try {
    const createdNews = await News.create({
      title: trimmedTitle,
      content: trimmedContent,
      author: req.user._id,
    });

    return res.status(201).json({
      news: {
        id: createdNews.id,
        title: createdNews.title,
        content: createdNews.content,
        author: createdNews.author,
        createdAt: createdNews.createdAt,
        updatedAt: createdNews.updatedAt,
      },
    });
  } catch (error) {
    console.error("[news-create-error]", error);
    return res.status(500).json({ message: "Δεν ήταν δυνατή η προσθήκη της είδησης." });
  }
});

const usersRouter = express.Router();

usersRouter.use(ensureAuthenticated);
usersRouter.use(ensureRole("admin"));

usersRouter.get("/", async (req, res) => {
  const rawSearch = req.query.search?.trim();
  const filter = rawSearch
    ? {
        $or: [
          { email: { $regex: escapeRegex(rawSearch), $options: "i" } },
          { displayName: { $regex: escapeRegex(rawSearch), $options: "i" } },
          { username: { $regex: escapeRegex(rawSearch), $options: "i" } },
          { firstName: { $regex: escapeRegex(rawSearch), $options: "i" } },
          { lastName: { $regex: escapeRegex(rawSearch), $options: "i" } },
        ],
      }
    : {};

  try {
    const users = await User.find(filter).sort({ createdAt: -1 }).limit(200);
    return res.json({ users: users.map(sanitizeUser) });
  } catch (error) {
    console.error("[users-list-error]", error);
    return res.status(500).json({ message: "Δεν ήταν δυνατή η ανάκτηση χρηστών." });
  }
});

usersRouter.put("/:userId/role", async (req, res) => {
  const { userId } = req.params;
  const { role } = req.body || {};
  const allowedRoles = ["user", "reporter", "admin"];

  if (!mongoose.Types.ObjectId.isValid(userId)) {
    return res.status(400).json({ message: "Μη έγκυρο αναγνωριστικό χρήστη." });
  }

  if (!allowedRoles.includes(role)) {
    return res.status(400).json({ message: "Μη έγκυρος ρόλος." });
  }

  try {
    const targetUser = await User.findById(userId);

    if (!targetUser) {
      return res.status(404).json({ message: "Ο χρήστης δεν βρέθηκε." });
    }

    targetUser.role = role;
    await targetUser.save();

    return res.json({ user: sanitizeUser(targetUser) });
  } catch (error) {
    console.error("[users-role-update-error]", error);
    return res.status(500).json({ message: "Δεν ήταν δυνατή η ενημέρωση του ρόλου." });
  }
});

authRouter.post("/register", async (req, res) => {
  const { email, password, displayName, firstName, lastName, mobile, country, occupation } = req.body || {};

  if (!email || !password) {
    return res.status(400).json({ message: "Απαιτούνται email και κωδικός." });
  }

  const normalizedEmail = String(email).toLowerCase().trim();
  const trimmedName = displayName?.trim();
  const trimmedFirstName = firstName?.trim();
  const trimmedLastName = lastName?.trim();
  const trimmedMobile = mobile?.trim();
  const trimmedCountry = country?.trim();
  const trimmedOccupation = occupation?.trim();

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
      providerId: normalizedEmail,
      email: normalizedEmail,
      password: hashPassword(password),
      displayName: trimmedName || [trimmedFirstName, trimmedLastName].filter(Boolean).join(" ") || normalizedEmail.split("@")[0],
      firstName: trimmedFirstName || undefined,
      lastName: trimmedLastName || undefined,
      mobile: trimmedMobile || undefined,
      country: trimmedCountry || undefined,
      occupation: trimmedOccupation || undefined,
    });

    req.login(newUser, (error) => {
      if (error) {
        return res.status(500).json({ message: "Η δημιουργία συνεδρίας απέτυχε." });
      }
      return res.status(201).json({ user: sanitizeUser(newUser) });
    });
  } catch (error) {
    console.error("[register-error]", error);
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

authRouter.put("/profile", ensureAuthenticated, async (req, res) => {
  const allowedFields = [
    "firstName",
    "lastName",
    "username",
    "mobile",
    "country",
    "occupation",
    "region",
    "cityOrVillage",
  ];
  const updates = {};

  for (const field of allowedFields) {
    if (field in req.body) {
      const rawValue = req.body[field];
      const trimmedValue = typeof rawValue === "string" ? rawValue.trim() : rawValue;
      updates[field] = trimmedValue || undefined;
    }
  }

  if (updates.username) {
    const existingUser = await User.findOne({ username: updates.username, _id: { $ne: req.user._id } });
    if (existingUser) {
      return res.status(409).json({ message: "Το username χρησιμοποιείται ήδη." });
    }
  }

  if ("region" in updates && updates.region && !REGION_NAMES.includes(updates.region)) {
    return res.status(400).json({ message: "Η περιφέρεια δεν είναι διαθέσιμη." });
  }

  const nextRegion = updates.region ?? req.user.region;

  if ("cityOrVillage" in updates) {
    if (!updates.cityOrVillage) {
      updates.cityOrVillage = undefined;
    } else if (!nextRegion) {
      return res.status(400).json({ message: "Επιλέξτε πρώτα περιφέρεια για να ορίσετε πόλη ή χωριό." });
    } else if (!CITIES_BY_REGION[nextRegion]?.includes(updates.cityOrVillage)) {
      return res.status(400).json({ message: "Η πόλη ή το χωριό δεν ανήκει στην επιλεγμένη περιφέρεια." });
    }
  }

  if (updates.region && req.user.cityOrVillage && !CITIES_BY_REGION[updates.region]?.includes(req.user.cityOrVillage)) {
    updates.cityOrVillage = undefined;
  }

  try {
    Object.entries(updates).forEach(([key, value]) => {
      req.user[key] = value;
    });

    await req.user.save();

    return res.json({ user: sanitizeUser(req.user) });
  } catch (error) {
    console.error("[profile-update-error]", error);
    return res.status(500).json({ message: "Δεν ήταν δυνατή η ενημέρωση του προφίλ." });
  }
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
    failureRedirect: `${CLIENT_ORIGIN}/auth/error`,
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
    failureRedirect: `${CLIENT_ORIGIN}/auth/error`,
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
app.use("/news", newsRouter);
app.use("/api/news", newsRouter);
app.use("/users", usersRouter);
app.use("/api/users", usersRouter);

authRouter.get("/debug-sentry", function mainHandler(req, res) {
  throw new Error("Sentry Test Error!");
});

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
  console.warn(`Client build not found at ${clientBuildPath}. Mission and other routes will return 404s.`);
}

// The Sentry error handler must be before any other error middleware
// and after all controllers
app.use(Sentry.expressErrorHandler());

app.use(function onError(err, req, res, next) {
  // The error id is attached to `res.sentry` to be returned
  // and optionally displayed to the user for support.
  res.statusCode = 500;
  res.end(res.sentry + "\n");
});

app.listen(PORT, () => console.log(`Server running on port ${PORT}`));
