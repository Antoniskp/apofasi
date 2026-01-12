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
import Poll from "./models/Poll.js";
import User from "./models/User.js";
import ContactMessage from "./models/ContactMessage.js";
import { CITIES_BY_REGION, REGION_NAMES } from "../shared/locations.js";
import defaultPolls from "./data/defaultPolls.js";

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

const WORLD_BANK_BASE = "https://api.worldbank.org/v2/country/GRC/indicator/";

const fetchWorldBankIndicator = async (indicator, perPage = 10) => {
  const response = await fetch(
    `${WORLD_BANK_BASE}${indicator}?format=json&per_page=${perPage}`
  );
  if (!response.ok) {
    throw new Error(`World Bank request failed for ${indicator}`);
  }
  const payload = await response.json();
  const series = Array.isArray(payload[1]) ? payload[1] : [];
  return series
    .filter((entry) => entry.value !== null && entry.date)
    .map((entry) => ({
      year: Number(entry.date),
      value: entry.value,
    }));
};

const formatPercent = (value) =>
  new Intl.NumberFormat("el-GR", {
    minimumFractionDigits: 1,
    maximumFractionDigits: 1,
  }).format(value);

const calculateTrend = (latest, previous) => {
  if (previous === null || previous === undefined) {
    return { label: "Σταθερό", className: "neutral" };
  }
  const delta = latest - previous;
  if (Math.abs(delta) < 0.1) {
    return { label: "Σταθερό", className: "neutral" };
  }
  if (delta > 0) {
    return { label: "Άνοδος", className: "positive" };
  }
  return { label: "Πτώση", className: "negative" };
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

const serializeAuthor = (user) => {
  if (!user) return null;

  if (typeof user === "string") {
    return { id: user };
  }

  return {
    id: user.id || user._id,
    displayName: user.displayName || user.username || user.email,
  };
};

const serializeNews = (news) => ({
  id: news.id,
  title: news.title,
  content: news.content,
  author: serializeAuthor(news.author),
  createdAt: news.createdAt,
  updatedAt: news.updatedAt,
});

const serializePoll = (poll, currentUser, session) => {
  const totalVotes =
    poll.options?.reduce((sum, option) => sum + (option.votes || 0), 0) || 0;
  const hasVoted = currentUser
    ? poll.votedUsers?.some((userId) => userId.toString() === currentUser.id)
    : false;
  const hasVotedAnonymously = poll.anonymousResponses
    ? session?.anonymousPollVotes?.includes(poll.id?.toString())
    : false;

  return {
    id: poll.id,
    question: poll.question,
    options: (poll.options || []).map((option) => ({
      id: option._id?.toString() || String(option.text),
      text: option.text,
      votes: option.votes || 0,
    })),
    tags: poll.tags || [],
    region: poll.region,
    cityOrVillage: poll.cityOrVillage,
    createdBy: poll.isAnonymousCreator ? null : serializeAuthor(poll.createdBy),
    isAnonymousCreator: Boolean(poll.isAnonymousCreator),
    anonymousResponses: Boolean(poll.anonymousResponses),
    createdAt: poll.createdAt,
    updatedAt: poll.updatedAt,
    totalVotes,
    hasVoted: hasVoted || hasVotedAnonymously,
  };
};

const seedDefaultPolls = async () => {
  if (process.env.SEED_DEFAULT_POLLS === "false") return;

  const existingPolls = await Poll.estimatedDocumentCount();

  if (existingPolls > 0) {
    return;
  }

  await Poll.create(defaultPolls);
  console.log(`[polls-seed] Added ${defaultPolls.length} default polls.`);
};

mongoose.connection.once("open", () => {
  seedDefaultPolls().catch((error) => {
    console.error("[polls-seed-error]", error);
  });
});

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
const pollsRouter = express.Router();
const contactRouter = express.Router();
const statisticsRouter = express.Router();

statisticsRouter.get("/", async (req, res) => {
  try {
    const [gdpGrowth, inflation, unemployment, debt, spending] = await Promise.all([
      fetchWorldBankIndicator("NY.GDP.MKTP.KD.ZG", 8),
      fetchWorldBankIndicator("FP.CPI.TOTL.ZG", 5),
      fetchWorldBankIndicator("SL.UEM.TOTL.ZS", 5),
      fetchWorldBankIndicator("GC.DOD.TOTL.GD.ZS", 5),
      fetchWorldBankIndicator("GC.XPN.TOTL.GD.ZS", 5),
    ]);

    const growthSeries = gdpGrowth
      .slice(0, 5)
      .map((entry) => ({
        year: String(entry.year),
        value: entry.value,
      }))
      .reverse();

    const indicatorConfigs = [
      { label: "Πληθωρισμός (ΔΤΚ)", data: inflation },
      { label: "Ανεργία", data: unemployment },
      { label: "Δημόσιο χρέος (% ΑΕΠ)", data: debt },
      { label: "Δημόσιες δαπάνες (% ΑΕΠ)", data: spending },
    ];

    const indicators = indicatorConfigs.map(({ label, data }) => {
      const [latest, previous] = data;
      const trend = calculateTrend(latest?.value, previous?.value);
      return {
        indicator: label,
        latest: latest ? `${formatPercent(latest.value)}%` : "—",
        year: latest?.year ? String(latest.year) : "—",
        trend: trend.label,
        trendClass: trend.className,
      };
    });

    res.json({
      growth: growthSeries,
      indicators,
      updatedAt: new Date().toLocaleString("el-GR"),
      source: "World Bank",
    });
  } catch (error) {
    console.error("[statistics-error]", error);
    res.status(502).json({ message: "Δεν ήταν δυνατή η ανάκτηση των δεικτών." });
  }
});

newsRouter.get("/", async (req, res) => {
  try {
    const newsItems = await News.find()
      .sort({ createdAt: -1 })
      .limit(50)
      .populate("author", "displayName username email");

    return res.json({ news: newsItems.map(serializeNews) });
  } catch (error) {
    console.error("[news-list-error]", error);
    return res.status(500).json({ message: "Δεν ήταν δυνατή η ανάκτηση ειδήσεων." });
  }
});

newsRouter.post("/", ensureAuthenticated, ensureRole("reporter", "admin"), async (req, res) => {
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

    const populatedNews = await createdNews.populate("author", "displayName username email");

    return res.status(201).json({
      news: serializeNews(populatedNews),
    });
  } catch (error) {
    console.error("[news-create-error]", error);
    return res.status(500).json({ message: "Δεν ήταν δυνατή η προσθήκη της είδησης." });
  }
});

pollsRouter.get("/", async (req, res) => {
  try {
    const polls = await Poll.find()
      .sort({ createdAt: -1 })
      .limit(100)
      .populate("createdBy", "displayName username email");

    return res.json({ polls: polls.map((poll) => serializePoll(poll, req.user, req.session)) });
  } catch (error) {
    console.error("[polls-list-error]", error);
    return res.status(500).json({ message: "Δεν ήταν δυνατή η ανάκτηση ψηφοφοριών." });
  }
});

pollsRouter.get("/:pollId", async (req, res) => {
  const { pollId } = req.params;

  if (!mongoose.Types.ObjectId.isValid(pollId)) {
    return res.status(400).json({ message: "Μη έγκυρη ψηφοφορία." });
  }

  try {
    const poll = await Poll.findById(pollId).populate("createdBy", "displayName username email");

    if (!poll) {
      return res.status(404).json({ message: "Η ψηφοφορία δεν βρέθηκε." });
    }

    return res.json({ poll: serializePoll(poll, req.user, req.session) });
  } catch (error) {
    console.error("[polls-detail-error]", error);
    return res.status(500).json({ message: "Δεν ήταν δυνατή η ανάκτηση της ψηφοφορίας." });
  }
});

pollsRouter.post("/", ensureAuthenticated, async (req, res) => {
  const {
    question,
    options,
    tags,
    region,
    cityOrVillage,
    isAnonymousCreator,
    anonymousResponses,
  } = req.body || {};
  const trimmedQuestion = question?.trim();

  const normalizedOptions = Array.isArray(options)
    ? options
    : typeof options === "string"
      ? options.split(",")
      : [];

  const cleanedOptions = normalizedOptions
    .map((option) => (typeof option === "string" ? option : option?.text))
    .map((text) => text?.trim())
    .filter(Boolean);

  const uniqueOptions = Array.from(new Set(cleanedOptions));

  if (!trimmedQuestion || uniqueOptions.length < 2) {
    return res
      .status(400)
      .json({ message: "Χρειάζονται ερώτηση και τουλάχιστον δύο μοναδικές επιλογές." });
  }

  if (uniqueOptions.length !== cleanedOptions.length) {
    return res.status(400).json({ message: "Οι επιλογές πρέπει να είναι διαφορετικές μεταξύ τους." });
  }

  const normalizedTags = Array.from(
    new Set(
      (Array.isArray(tags) ? tags : typeof tags === "string" ? tags.split(",") : [])
        .map((tag) => (typeof tag === "string" ? tag.trim() : ""))
        .filter(Boolean)
    )
  ).slice(0, 10);

  const trimmedRegion = region?.trim();
  const trimmedCity = cityOrVillage?.trim();
  const shouldHideCreator = Boolean(isAnonymousCreator);
  const shouldHideResponders = Boolean(anonymousResponses);

  if (trimmedRegion && !REGION_NAMES.includes(trimmedRegion)) {
    return res.status(400).json({ message: "Η περιφέρεια δεν είναι διαθέσιμη." });
  }

  if (trimmedCity) {
    if (!trimmedRegion) {
      return res
        .status(400)
        .json({ message: "Επιλέξτε πρώτα περιφέρεια για να προσθέσετε πόλη ή χωριό." });
    }

    if (!CITIES_BY_REGION[trimmedRegion]?.includes(trimmedCity)) {
      return res.status(400).json({ message: "Η πόλη ή το χωριό δεν ανήκει στην επιλεγμένη περιφέρεια." });
    }
  }

  try {
    const createdPoll = await Poll.create({
      question: trimmedQuestion,
      options: uniqueOptions.map((text) => ({ text })),
      tags: normalizedTags,
      region: trimmedRegion,
      cityOrVillage: trimmedCity,
      isAnonymousCreator: shouldHideCreator,
      anonymousResponses: shouldHideResponders,
      createdBy: req.user._id,
    });

    const populatedPoll = await createdPoll.populate("createdBy", "displayName username email");

    return res.status(201).json({ poll: serializePoll(populatedPoll, req.user, req.session) });
  } catch (error) {
    console.error("[polls-create-error]", error);
    return res.status(500).json({ message: "Δεν ήταν δυνατή η δημιουργία ψηφοφορίας." });
  }
});

pollsRouter.post("/:pollId/vote", async (req, res) => {
  const { pollId } = req.params;
  const { optionId } = req.body || {};
  const userId = req.user?.id;

  if (!mongoose.Types.ObjectId.isValid(pollId)) {
    return res.status(400).json({ message: "Μη έγκυρη ψηφοφορία." });
  }

  if (!optionId) {
    return res.status(400).json({ message: "Επιλέξτε μία από τις διαθέσιμες απαντήσεις." });
  }

  try {
    const poll = await Poll.findById(pollId).populate("createdBy", "displayName username email");

    if (!poll) {
      return res.status(404).json({ message: "Η ψηφοφορία δεν βρέθηκε." });
    }

    const pollIdStr = poll.id?.toString();

    if (!poll.anonymousResponses && !userId) {
      return res.status(401).json({ message: "Χρειάζεται σύνδεση για να ψηφίσετε." });
    }

    const alreadyVoted = !poll.anonymousResponses
      ? poll.votedUsers?.some((storedId) => storedId.toString() === userId)
      : false;

    if (alreadyVoted) {
      return res.status(400).json({ message: "Έχετε ήδη ψηφίσει σε αυτή την ψηφοφορία." });
    }

    if (poll.anonymousResponses) {
      const anonymousVotes = req.session.anonymousPollVotes || [];
      if (pollIdStr && anonymousVotes.includes(pollIdStr)) {
        return res
          .status(400)
          .json({ message: "Έχετε ήδη ψηφίσει ανώνυμα σε αυτή την ψηφοφορία." });
      }
    }

    const selectedOption = poll.options.id(optionId) ||
      poll.options.find((option) => option._id?.toString() === optionId);

    if (!selectedOption) {
      return res.status(400).json({ message: "Μη έγκυρη επιλογή ψηφοφορίας." });
    }

    selectedOption.votes += 1;

    if (poll.anonymousResponses) {
      if (pollIdStr) {
        const anonymousVotes = new Set(req.session.anonymousPollVotes || []);
        anonymousVotes.add(pollIdStr);
        req.session.anonymousPollVotes = Array.from(anonymousVotes);
      }
    } else {
      poll.votedUsers.push(req.user._id);
    }

    await poll.save();

    return res.json({ poll: serializePoll(poll, req.user, req.session) });
  } catch (error) {
    console.error("[polls-vote-error]", error);
    return res.status(500).json({ message: "Δεν ήταν δυνατή η καταχώρηση της ψήφου." });
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

contactRouter.post("/", async (req, res) => {
  const { name, email, topic, message } = req.body || {};
  const trimmedName = name?.trim();
  const normalizedEmail = email?.trim().toLowerCase();
  const trimmedTopic = topic?.trim();
  const trimmedMessage = message?.trim();

  if (!trimmedMessage || trimmedMessage.length < 10) {
    return res
      .status(400)
      .json({ message: "Παρακαλώ γράψτε ένα μήνυμα με τουλάχιστον 10 χαρακτήρες." });
  }

  const finalEmail = normalizedEmail || req.user?.email;
  const finalName = trimmedName || req.user?.displayName || req.user?.username;

  if (!finalEmail || !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(finalEmail)) {
    return res.status(400).json({ message: "Απαιτείται έγκυρο email επικοινωνίας." });
  }

  const userSnapshot = req.user
    ? {
        id: req.user.id,
        displayName: req.user.displayName,
        email: req.user.email,
        username: req.user.username,
        provider: req.user.provider,
        role: req.user.role,
      }
    : undefined;

  try {
    const createdMessage = await ContactMessage.create({
      name: finalName,
      email: finalEmail,
      topic: trimmedTopic || "general",
      message: trimmedMessage,
      user: req.user?._id,
      userSnapshot,
      ipAddress: req.ip,
      userAgent: req.get("user-agent"),
      referrer: req.get("referer"),
    });

    return res.status(201).json({
      message: "Το μήνυμα καταχωρήθηκε με επιτυχία.",
      contact: {
        id: createdMessage.id,
        topic: createdMessage.topic,
        createdAt: createdMessage.createdAt,
      },
    });
  } catch (error) {
    console.error("[contact-create-error]", error);
    return res.status(500).json({ message: "Δεν ήταν δυνατή η αποστολή του μηνύματος." });
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
app.use("/polls", pollsRouter);
app.use("/api/polls", pollsRouter);
app.use("/users", usersRouter);
app.use("/api/users", usersRouter);
app.use("/contact", contactRouter);
app.use("/api/contact", contactRouter);
app.use("/api/government-statistics", statisticsRouter);

authRouter.get("/debug-sentry", function mainHandler(req, res) {
  throw new Error("Sentry Test Error!");
});

const PORT = process.env.PORT || 5000;
const HOST = "127.0.0.1";

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

app.listen(PORT, HOST, () => {
  console.log(`Listening on http://${HOST}:${PORT}`);
});
