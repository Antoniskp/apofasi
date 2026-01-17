import * as Sentry from "@sentry/node";
import { nodeProfilingIntegration } from "@sentry/profiling-node";
import cors from "cors";
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
import AnonymousVote from "./models/AnonymousVote.js";
import Article from "./models/Article.js";
import { CITIES_BY_REGION, REGION_NAMES, COUNTRIES, GREEK_JURISDICTION_NAMES, CITIES_BY_JURISDICTION } from "../shared/locations.js";
import defaultPolls from "./data/defaultPolls.js";
import { hashPassword, needsPasswordUpgrade, verifyPassword } from "./utils/crypto.js";
import { isHttpsUrl, validatePhotoDataUrl } from "./utils/pollValidation.js";

// Get directory name for ES modules
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

dotenv.config({ path: path.join(__dirname, ".env") });
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

const app = express();
app.set("trust proxy", 1);

// CORS must be the first middleware on the app
app.use(cors(corsOptions));
app.options("*", cors(corsOptions));
const authRouter = express.Router();
const shouldLogRequests = process.env.REQUEST_LOGGING === "true";
const oauthProviders = {
  google: Boolean(process.env.GOOGLE_CLIENT_ID && process.env.GOOGLE_CLIENT_SECRET),
  facebook: Boolean(process.env.FACEBOOK_APP_ID && process.env.FACEBOOK_APP_SECRET),
  github: Boolean(process.env.GITHUB_CLIENT_ID && process.env.GITHUB_CLIENT_SECRET),
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
      occupation: user.occupation,
      // New location hierarchy
      locationCountry: user.locationCountry,
      locationJurisdiction: user.locationJurisdiction,
      locationCity: user.locationCity,
      // Legacy location fields for backward compatibility
      country: user.country,
      region: user.region,
      cityOrVillage: user.cityOrVillage,
      createdAt: user.createdAt,
      visibleToOtherUsers: user.visibleToOtherUsers,
    }
    : null;

const escapeRegex = (value = "") => {
  const pattern = /[.*+?^${}()|[\]\\]/g;
  return value.replace(pattern, "\\$&");
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

const serializeArticle = (article) => ({
  id: article.id,
  title: article.title,
  subtitle: article.subtitle,
  content: article.content,
  author: serializeAuthor(article.author),
  tags: article.tags || [],
  sources: article.sources || [],
  photoUrl: article.photoUrl,
  photo: article.photo,
  // New location hierarchy
  locationCountry: article.locationCountry,
  locationJurisdiction: article.locationJurisdiction,
  locationCity: article.locationCity,
  // Legacy location fields for backward compatibility
  region: article.region,
  cityOrVillage: article.cityOrVillage,
  isNews: Boolean(article.isNews),
  taggedAsNewsBy: article.taggedAsNewsBy ? serializeAuthor(article.taggedAsNewsBy) : null,
  taggedAsNewsAt: article.taggedAsNewsAt,
  createdAt: article.createdAt,
  updatedAt: article.updatedAt,
});

const serializePoll = async (poll, currentUser, session, req) => {
  // Check if current user is the poll creator or admin
  const isCreatorOrAdmin = currentUser && (
    (poll.createdBy && poll.createdBy.toString() === currentUser.id) ||
    currentUser.role === "admin"
  );

  // Filter options based on status
  const visibleOptions = isCreatorOrAdmin 
    ? poll.options 
    : poll.options?.filter(opt => opt.status === "approved") || [];

  const totalVotes =
    visibleOptions.reduce((sum, option) => sum + (option.votes || 0), 0) || 0;
  
  // For logged-in users, check userVotes array
  let hasVoted = false;
  let votedOptionId = null;
  
  if (currentUser && !poll.anonymousResponses) {
    const userVote = poll.userVotes?.find((uv) => uv.userId.toString() === currentUser.id);
    if (userVote) {
      hasVoted = true;
      votedOptionId = userVote.optionId.toString();
    }
  }
  
  // For anonymous polls, check both session and IP (requires BOTH to match for security)
  if (poll.anonymousResponses) {
    const sessionId = session?.id;
    const ipAddress = req?.ip;
    
    // Require BOTH sessionId AND ipAddress for secure vote tracking
    if (sessionId && ipAddress) {
      const anonymousVote = await AnonymousVote.findOne({
        pollId: poll._id,
        sessionId,
        ipAddress,
      });
      
      if (anonymousVote) {
        hasVoted = true;
        votedOptionId = anonymousVote.optionId.toString();
      }
    }
  }

  return {
    id: poll.id,
    question: poll.question,
    options: visibleOptions.map((option) => ({
      id: option._id?.toString() || String(option.text),
      text: option.text,
      votes: option.votes || 0,
      status: option.status,
      createdBy: option.createdBy ? serializeAuthor(option.createdBy) : null,
      photoUrl: option.photoUrl,
      photo: option.photo,
      profileUrl: option.profileUrl,
    })),
    tags: poll.tags || [],
    // New location hierarchy
    locationCountry: poll.locationCountry,
    locationJurisdiction: poll.locationJurisdiction,
    locationCity: poll.locationCity,
    // Legacy location fields for backward compatibility
    region: poll.region,
    cityOrVillage: poll.cityOrVillage,
    createdBy: poll.isAnonymousCreator ? null : serializeAuthor(poll.createdBy),
    isAnonymousCreator: Boolean(poll.isAnonymousCreator),
    anonymousResponses: Boolean(poll.anonymousResponses),
    allowUserOptions: Boolean(poll.allowUserOptions),
    userOptionApproval: poll.userOptionApproval || "auto",
    optionsArePeople: Boolean(poll.optionsArePeople),
    linkPolicy: poll.linkPolicy || { mode: "any", allowedDomains: [] },
    voteClosingDate: poll.voteClosingDate || null,
    restrictToLocation: Boolean(poll.restrictToLocation),
    createdAt: poll.createdAt,
    updatedAt: poll.updatedAt,
    totalVotes,
    hasVoted,
    votedOptionId,
    isCreatorOrAdmin,
    // Security information for transparency
    voteSecurity: {
      method: poll.anonymousResponses ? "anonymous" : "authenticated",
      description: poll.anonymousResponses 
        ? "Ανώνυμες ψηφοφορίες απαιτούν session και IP για την αποτροπή πολλαπλών ψήφων από την ίδια συσκευή."
        : "Εγγεγραμμένοι χρήστες μπορούν να ψηφίσουν μία φορά ανά λογαριασμό, ανεξάρτητα από συσκευή ή IP.",
      canVoteMultipleTimes: false,
    },
  };
};

const ensureDatabaseReady = (req, res, next) => {
  if (mongoose.connection.readyState !== 1) {
    return res.status(503).json({ message: "Η βάση δεδομένων δεν είναι διαθέσιμη." });
  }
  return next();
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

app.use(express.json({ limit: "1mb" }));

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
// Determine session cookie configuration
// SameSite=None requires Secure=true (HTTPS), so we need to coordinate these settings
const getSessionCookieConfig = () => {
  const hasSecureOverride = process.env.SESSION_SECURE !== undefined;
  const hasSameSiteOverride = process.env.SESSION_SAMESITE !== undefined;

  // Allow explicit override via environment variables
  if (hasSecureOverride || hasSameSiteOverride) {
    const secure = hasSecureOverride 
      ? process.env.SESSION_SECURE === "true" 
      : false;
    const sameSite = process.env.SESSION_SAMESITE || "lax";

    // Validate SESSION_SECURE value
    if (hasSecureOverride && !["true", "false"].includes(process.env.SESSION_SECURE)) {
      throw new Error(
        `Invalid SESSION_SECURE value: "${process.env.SESSION_SECURE}". Must be "true" or "false".`
      );
    }

    // Validate SESSION_SAMESITE value
    if (hasSameSiteOverride && !["none", "lax", "strict"].includes(sameSite)) {
      throw new Error(
        `Invalid SESSION_SAMESITE value: "${sameSite}". Must be "none", "lax", or "strict".`
      );
    }

    // Warn about potentially insecure configuration
    if (sameSite === "none" && !secure) {
      console.warn(
        "[session-config-warning] SameSite=None requires Secure=true (HTTPS). " +
        "Browsers will reject cookies with SameSite=None over HTTP. " +
        "Consider using SESSION_SAMESITE=lax for HTTP deployments."
      );
    }

    return {
      secure,
      sameSite,
      httpOnly: true,
      maxAge: sessionMaxAgeMs,
    };
  }

  // Auto-detect based on NODE_ENV and assume HTTPS in production
  // In production behind a reverse proxy with HTTPS, use secure=true and sameSite=none
  // In development or HTTP-only deployments, use secure=false and sameSite=lax
  const isProduction = process.env.NODE_ENV === "production";
  const useSecureCookies = isProduction; // Assume HTTPS in production

  return {
    secure: useSecureCookies,
    sameSite: useSecureCookies ? "none" : "lax",
    httpOnly: true,
    maxAge: sessionMaxAgeMs,
  };
};

app.use(
  session({
    name: process.env.SESSION_NAME || "apofasi.sid",
    secret: process.env.SESSION_SECRET || "apofasi-session-secret",
    resave: false,
    saveUninitialized: false,
    proxy: true,
    store: sessionStore,
    cookie: getSessionCookieConfig(),
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
const articlesRouter = express.Router();

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

newsRouter.post("/", ensureAuthenticated, ensureRole("reporter", "editor", "admin"), async (req, res) => {
  // Deprecated: Standalone news items are no longer supported
  // Use articles with the isNews flag instead
  return res.status(410).json({ 
    message: "Δημιουργία ξεχωριστών ειδήσεων δεν υποστηρίζεται πλέον. Χρησιμοποιήστε άρθρα και επισημάνετέ τα ως ειδήσεις." 
  });
});

// Helper functions for article validation
const normalizeArticleTags = (tags) => {
  return Array.from(
    new Set(
      (Array.isArray(tags) ? tags : typeof tags === "string" ? tags.split(",") : [])
        .map((tag) => (typeof tag === "string" ? tag.trim() : ""))
        .filter(Boolean)
    )
  ).slice(0, 10);
};

const normalizeArticleSources = (sources) => {
  return Array.from(
    new Set(
      (Array.isArray(sources) ? sources : typeof sources === "string" ? sources.split(/\r?\n/) : [])
        .map((source) => (typeof source === "string" ? source.trim() : ""))
        .filter(Boolean)
    )
  ).slice(0, 10);
};

const normalizeArticlePhoto = (photoUrl, photo) => {
  const trimmedPhotoUrl = typeof photoUrl === "string" ? photoUrl.trim() : "";
  const trimmedPhoto = typeof photo === "string" ? photo.trim() : "";

  if (trimmedPhotoUrl && !isHttpsUrl(trimmedPhotoUrl)) {
    return { valid: false, error: "Το URL φωτογραφίας πρέπει να είναι HTTPS." };
  }

  if (trimmedPhoto) {
    const photoValidation = validatePhotoDataUrl(trimmedPhoto);
    if (!photoValidation.valid) {
      return photoValidation;
    }
  }

  return {
    valid: true,
    photoUrl: trimmedPhotoUrl || undefined,
    photo: trimmedPhoto || undefined,
  };
};

const validateArticleLocation = (region, cityOrVillage) => {
  const trimmedRegion = region?.trim();
  const trimmedCity = cityOrVillage?.trim();

  if (trimmedRegion && !REGION_NAMES.includes(trimmedRegion)) {
    return { valid: false, error: "Η περιφέρεια δεν είναι διαθέσιμη." };
  }

  if (trimmedCity) {
    if (!trimmedRegion) {
      return {
        valid: false,
        error: "Επιλέξτε πρώτα περιφέρεια για να προσθέσετε πόλη ή χωριό.",
      };
    }

    if (!CITIES_BY_REGION[trimmedRegion]?.includes(trimmedCity)) {
      return {
        valid: false,
        error: "Η πόλη ή το χωριό δεν ανήκει στην επιλεγμένη περιφέρεια.",
      };
    }
  }

  return { valid: true, region: trimmedRegion, cityOrVillage: trimmedCity };
};

// New validation function for hierarchical location
const validateLocationHierarchy = (locationCountry, locationJurisdiction, locationCity) => {
  const trimmedCountry = locationCountry?.trim();
  const trimmedJurisdiction = locationJurisdiction?.trim();
  const trimmedCity = locationCity?.trim();

  // Validate country
  if (trimmedCountry && !COUNTRIES.find(c => c.value === trimmedCountry)) {
    return { valid: false, error: "Η χώρα δεν είναι διαθέσιμη." };
  }

  // Validate jurisdiction (only for Greece)
  if (trimmedJurisdiction) {
    if (trimmedCountry !== "greece") {
      return {
        valid: false,
        error: "Η περιφέρεια είναι διαθέσιμη μόνο για την Ελλάδα.",
      };
    }

    if (!GREEK_JURISDICTION_NAMES.includes(trimmedJurisdiction)) {
      return { valid: false, error: "Η περιφέρεια δεν είναι διαθέσιμη." };
    }
  }

  // Validate city
  if (trimmedCity) {
    if (!trimmedJurisdiction) {
      return {
        valid: false,
        error: "Επιλέξτε πρώτα περιφέρεια για να προσθέσετε πόλη ή κοινότητα.",
      };
    }

    if (!CITIES_BY_JURISDICTION[trimmedJurisdiction]?.includes(trimmedCity)) {
      return {
        valid: false,
        error: "Η πόλη ή η κοινότητα δεν ανήκει στην επιλεγμένη περιφέρεια.",
      };
    }
  }

  return { 
    valid: true, 
    locationCountry: trimmedCountry || "", 
    locationJurisdiction: trimmedJurisdiction || "", 
    locationCity: trimmedCity || "" 
  };
};

// Helper function to process location fields from request
const processLocationFields = (req) => {
  const { region, cityOrVillage, locationCountry, locationJurisdiction, locationCity } = req.body || {};
  
  // Support both old and new location fields
  if (locationCountry || locationJurisdiction || locationCity) {
    // Use new hierarchy
    const locationValidation = validateLocationHierarchy(locationCountry, locationJurisdiction, locationCity);
    if (!locationValidation.valid) {
      return { error: locationValidation.error };
    }
    return {
      data: {
        locationCountry: locationValidation.locationCountry || undefined,
        locationJurisdiction: locationValidation.locationJurisdiction || undefined,
        locationCity: locationValidation.locationCity || undefined,
      }
    };
  } else if (region || cityOrVillage) {
    // Use old fields for backward compatibility
    const locationValidation = validateArticleLocation(region, cityOrVillage);
    if (!locationValidation.valid) {
      return { error: locationValidation.error };
    }
    return {
      data: {
        region: locationValidation.region || undefined,
        cityOrVillage: locationValidation.cityOrVillage || undefined,
      }
    };
  }
  
  return { data: {} };
};

// Articles routes
articlesRouter.get("/", async (req, res) => {
  try {
    const articles = await Article.find()
      .sort({ createdAt: -1 })
      .limit(100)
      .populate("author", "displayName username email")
      .populate("taggedAsNewsBy", "displayName username email");

    return res.json({ articles: articles.map(serializeArticle) });
  } catch (error) {
    console.error("[articles-list-error]", error);
    return res.status(500).json({ message: "Δεν ήταν δυνατή η ανάκτηση άρθρων." });
  }
});

articlesRouter.get("/my-articles", ensureAuthenticated, async (req, res) => {
  const userId = req.user?.id;

  try {
    const articles = await Article.find({ author: userId })
      .sort({ createdAt: -1 })
      .populate("author", "displayName username email")
      .populate("taggedAsNewsBy", "displayName username email");

    return res.json({ articles: articles.map(serializeArticle) });
  } catch (error) {
    console.error("[my-articles-error]", error);
    return res.status(500).json({ message: "Δεν ήταν δυνατή η ανάκτηση των άρθρων σας." });
  }
});

articlesRouter.get("/:articleId", async (req, res) => {
  const { articleId } = req.params;

  if (!mongoose.Types.ObjectId.isValid(articleId)) {
    return res.status(400).json({ message: "Μη έγκυρο άρθρο." });
  }

  try {
    const article = await Article.findById(articleId)
      .populate("author", "displayName username email")
      .populate("taggedAsNewsBy", "displayName username email");

    if (!article) {
      return res.status(404).json({ message: "Το άρθρο δεν βρέθηκε." });
    }

    return res.json({ article: serializeArticle(article) });
  } catch (error) {
    console.error("[article-detail-error]", error);
    return res.status(500).json({ message: "Δεν ήταν δυνατή η ανάκτηση του άρθρου." });
  }
});

articlesRouter.post("/", ensureAuthenticated, async (req, res) => {
  const { title, subtitle, content, tags, sources, photoUrl, photo } = req.body || {};
  const trimmedTitle = title?.trim();
  const trimmedSubtitle = subtitle?.trim();
  const trimmedContent = content?.trim();

  if (!trimmedTitle || !trimmedContent) {
    return res.status(400).json({ message: "Απαιτούνται τίτλος και περιεχόμενο." });
  }

  const normalizedTags = normalizeArticleTags(tags);
  const normalizedSources = normalizeArticleSources(sources);
  const photoResult = normalizeArticlePhoto(photoUrl, photo);

  if (!photoResult.valid) {
    return res.status(400).json({ message: photoResult.error || "Μη έγκυρη φωτογραφία άρθρου." });
  }
  
  const locationResult = processLocationFields(req);
  if (locationResult.error) {
    return res.status(400).json({ message: locationResult.error });
  }

  try {
    const articleData = {
      title: trimmedTitle,
      subtitle: trimmedSubtitle || undefined,
      content: trimmedContent,
      author: req.user._id,
      tags: normalizedTags,
      sources: normalizedSources,
      photoUrl: photoResult.photoUrl,
      photo: photoResult.photo,
      ...locationResult.data,
    };

    const createdArticle = await Article.create(articleData);

    await createdArticle.populate("author", "displayName username email");

    return res.status(201).json({
      article: serializeArticle(createdArticle),
    });
  } catch (error) {
    console.error("[article-create-error]", error);
    return res.status(500).json({ message: "Δεν ήταν δυνατή η δημιουργία του άρθρου." });
  }
});

articlesRouter.put("/:articleId", ensureAuthenticated, async (req, res) => {
  const { articleId } = req.params;
  const { title, subtitle, content, tags, sources, photoUrl, photo } = req.body || {};
  const userId = req.user?.id;
  const hasSubtitle = Object.prototype.hasOwnProperty.call(req.body || {}, "subtitle");
  const hasSources = Object.prototype.hasOwnProperty.call(req.body || {}, "sources");
  const hasPhotoFields = Object.prototype.hasOwnProperty.call(req.body || {}, "photoUrl")
    || Object.prototype.hasOwnProperty.call(req.body || {}, "photo");

  if (!mongoose.Types.ObjectId.isValid(articleId)) {
    return res.status(400).json({ message: "Μη έγκυρο άρθρο." });
  }

  const trimmedTitle = title?.trim();
  const trimmedContent = content?.trim();

  if (!trimmedTitle || !trimmedContent) {
    return res.status(400).json({ message: "Απαιτούνται τίτλος και περιεχόμενο." });
  }

  const normalizedTags = normalizeArticleTags(tags);
  const normalizedSources = hasSources ? normalizeArticleSources(sources) : null;
  const trimmedSubtitle = hasSubtitle ? subtitle?.trim() : null;
  const photoResult = hasPhotoFields ? normalizeArticlePhoto(photoUrl, photo) : null;

  if (photoResult && !photoResult.valid) {
    return res.status(400).json({ message: photoResult.error || "Μη έγκυρη φωτογραφία άρθρου." });
  }
  
  const locationResult = processLocationFields(req);
  if (locationResult.error) {
    return res.status(400).json({ message: locationResult.error });
  }

  try {
    const article = await Article.findById(articleId);

    if (!article) {
      return res.status(404).json({ message: "Το άρθρο δεν βρέθηκε." });
    }

    // Check if user is the author
    if (article.author.toString() !== userId) {
      return res.status(403).json({ message: "Δεν έχετε δικαίωμα να επεξεργαστείτε αυτό το άρθρο." });
    }

    article.title = trimmedTitle;
    if (hasSubtitle) {
      article.subtitle = trimmedSubtitle || undefined;
    }
    article.content = trimmedContent;
    article.tags = normalizedTags;
    if (hasSources) {
      article.sources = normalizedSources;
    }
    if (photoResult) {
      article.photoUrl = photoResult.photoUrl;
      article.photo = photoResult.photo;
    }
    
    // Update location fields
    Object.assign(article, locationResult.data);

    await article.save();

    await article.populate("author", "displayName username email");
    await article.populate("taggedAsNewsBy", "displayName username email");

    return res.json({ article: serializeArticle(article) });
  } catch (error) {
    console.error("[article-update-error]", error);
    return res.status(500).json({ message: "Δεν ήταν δυνατή η ενημέρωση του άρθρου." });
  }
});

articlesRouter.delete("/:articleId", ensureAuthenticated, async (req, res) => {
  const { articleId } = req.params;
  const userId = req.user?.id;

  if (!mongoose.Types.ObjectId.isValid(articleId)) {
    return res.status(400).json({ message: "Μη έγκυρο άρθρο." });
  }

  try {
    const article = await Article.findById(articleId);

    if (!article) {
      return res.status(404).json({ message: "Το άρθρο δεν βρέθηκε." });
    }

    // Check if user is the author or admin
    const isAuthor = article.author.toString() === userId;
    const isAdmin = req.user.role === "admin";

    if (!isAuthor && !isAdmin) {
      return res.status(403).json({ message: "Δεν έχετε δικαίωμα να διαγράψετε αυτό το άρθρο." });
    }

    await Article.deleteOne({ _id: article._id });

    return res.json({ message: "Το άρθρο διαγράφηκε επιτυχώς." });
  } catch (error) {
    console.error("[article-delete-error]", error);
    return res.status(500).json({ message: "Δεν ήταν δυνατή η διαγραφή του άρθρου." });
  }
});

articlesRouter.put("/:articleId/tag-as-news", ensureAuthenticated, ensureRole("reporter", "editor", "admin"), async (req, res) => {
  const { articleId } = req.params;

  if (!mongoose.Types.ObjectId.isValid(articleId)) {
    return res.status(400).json({ message: "Μη έγκυρο άρθρο." });
  }

  try {
    const article = await Article.findById(articleId);

    if (!article) {
      return res.status(404).json({ message: "Το άρθρο δεν βρέθηκε." });
    }

    article.isNews = true;
    article.taggedAsNewsBy = req.user._id;
    article.taggedAsNewsAt = new Date();

    await article.save();

    await article.populate("author", "displayName username email");
    await article.populate("taggedAsNewsBy", "displayName username email");

    return res.json({ article: serializeArticle(article) });
  } catch (error) {
    console.error("[article-tag-as-news-error]", error);
    return res.status(500).json({ message: "Δεν ήταν δυνατή η επισήμανση του άρθρου ως είδηση." });
  }
});

articlesRouter.put("/:articleId/untag-as-news", ensureAuthenticated, ensureRole("reporter", "editor", "admin"), async (req, res) => {
  const { articleId } = req.params;

  if (!mongoose.Types.ObjectId.isValid(articleId)) {
    return res.status(400).json({ message: "Μη έγκυρο άρθρο." });
  }

  try {
    const article = await Article.findById(articleId);

    if (!article) {
      return res.status(404).json({ message: "Το άρθρο δεν βρέθηκε." });
    }

    article.isNews = false;
    article.taggedAsNewsBy = undefined;
    article.taggedAsNewsAt = undefined;

    await article.save();

    await article.populate("author", "displayName username email");

    return res.json({ article: serializeArticle(article) });
  } catch (error) {
    console.error("[article-untag-as-news-error]", error);
    return res.status(500).json({ message: "Δεν ήταν δυνατή η αφαίρεση της επισήμανσης του άρθρου ως είδηση." });
  }
});

pollsRouter.get("/", async (req, res) => {
  try {
    const polls = await Poll.find()
      .sort({ createdAt: -1 })
      .limit(100)
      .populate("createdBy", "displayName username email");

    const serializedPolls = await Promise.all(
      polls.map((poll) => serializePoll(poll, req.user, req.session, req))
    );

    return res.json({ polls: serializedPolls });
  } catch (error) {
    console.error("[polls-list-error]", error);
    return res.status(500).json({ message: "Δεν ήταν δυνατή η ανάκτηση ψηφοφοριών." });
  }
});

// Get user's own polls
pollsRouter.get("/my-polls", ensureAuthenticated, async (req, res) => {
  const userId = req.user?.id;

  try {
    const polls = await Poll.find({ createdBy: userId })
      .sort({ createdAt: -1 })
      .populate("createdBy", "displayName username email");

    const serializedPolls = await Promise.all(
      polls.map((poll) => serializePoll(poll, req.user, req.session, req))
    );

    return res.json({ polls: serializedPolls });
  } catch (error) {
    console.error("[my-polls-error]", error);
    return res.status(500).json({ message: "Δεν ήταν δυνατή η ανάκτηση των ψηφοφοριών σας." });
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

    return res.json({ poll: await serializePoll(poll, req.user, req.session, req) });
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
    locationCountry,
    locationJurisdiction,
    locationCity,
    isAnonymousCreator,
    anonymousResponses,
    allowUserOptions,
    userOptionApproval,
    optionsArePeople,
    linkPolicy,
    voteClosingDate,
    restrictToLocation,
  } = req.body || {};
  const trimmedQuestion = question?.trim();

  const normalizedOptions = Array.isArray(options)
    ? options
    : typeof options === "string"
      ? options.split(",")
      : [];

  // Handle both string[] and object[] options
  let processedOptions;
  if (optionsArePeople) {
    // In people mode, options must be objects with required fields
    processedOptions = normalizedOptions
      .filter((option) => option && typeof option === "object")
      .map((option) => ({
        text: option.text?.trim() || "",
        photoUrl: option.photoUrl?.trim() || "",
        photo: option.photo || "",
        profileUrl: option.profileUrl?.trim() || "",
      }))
      .filter((option) => option.text);
  } else {
    // Legacy mode: accept string[] or extract text from objects
    const cleanedOptions = normalizedOptions
      .map((option) => (typeof option === "string" ? option : option?.text))
      .map((text) => text?.trim())
      .filter(Boolean);

    processedOptions = cleanedOptions.map((text) => ({ text }));
  }

  const uniqueOptions = Array.from(
    new Map(processedOptions.map((opt) => [opt.text, opt])).values()
  );

  // Validate question is provided
  if (!trimmedQuestion) {
    return res.status(400).json({ message: "Χρειάζεται ερώτηση." });
  }

  // Validate options based on allowUserOptions setting
  // When allowUserOptions is true, minOptionsRequired is 0 (no minimum)
  // When allowUserOptions is false, minOptionsRequired is 2 (existing behavior)
  const minOptionsRequired = allowUserOptions ? 0 : 2;
  if (uniqueOptions.length < minOptionsRequired) {
    // This only executes when allowUserOptions is false and we have < 2 options
    return res
      .status(400)
      .json({ message: "Χρειάζονται τουλάχιστον δύο μοναδικές επιλογές." });
  }

  // Check for duplicates only if we have options
  if (processedOptions.length > 0 && uniqueOptions.length !== processedOptions.length) {
    return res.status(400).json({ message: "Οι επιλογές πρέπει να είναι διαφορετικές μεταξύ τους." });
  }

  // Validate people mode options if enabled
  if (optionsArePeople) {
    const { validatePeopleOption } = await import("./utils/pollValidation.js");
    const normalizedLinkPolicy = linkPolicy || { mode: "any", allowedDomains: [] };
    
    for (const option of uniqueOptions) {
      const validation = validatePeopleOption(option, normalizedLinkPolicy);
      if (!validation.valid) {
        return res.status(400).json({ message: validation.error });
      }
    }
  }

  const normalizedTags = Array.from(
    new Set(
      (Array.isArray(tags) ? tags : typeof tags === "string" ? tags.split(",") : [])
        .map((tag) => (typeof tag === "string" ? tag.trim() : ""))
        .filter(Boolean)
    )
  ).slice(0, 10);

  const locationResult = processLocationFields(req);
  if (locationResult.error) {
    return res.status(400).json({ message: locationResult.error });
  }

  const shouldHideCreator = Boolean(isAnonymousCreator);
  const shouldHideResponders = Boolean(anonymousResponses);

  try {
    const pollData = {
      question: trimmedQuestion,
      options: uniqueOptions,
      tags: normalizedTags,
      ...locationResult.data,
      isAnonymousCreator: shouldHideCreator,
      anonymousResponses: shouldHideResponders,
      createdBy: req.user._id,
    };

    // Add new fields if provided
    if (allowUserOptions !== undefined) {
      pollData.allowUserOptions = Boolean(allowUserOptions);
    }
    if (userOptionApproval) {
      pollData.userOptionApproval = userOptionApproval;
    }
    if (optionsArePeople !== undefined) {
      pollData.optionsArePeople = Boolean(optionsArePeople);
    }
    if (linkPolicy) {
      const { validateLinkPolicy } = await import("./utils/pollValidation.js");
      const policyValidation = validateLinkPolicy(linkPolicy);
      if (!policyValidation.valid) {
        return res.status(400).json({ message: policyValidation.error });
      }
      pollData.linkPolicy = policyValidation.sanitized;
    }
    if (voteClosingDate) {
      const closingDate = new Date(voteClosingDate);
      if (isNaN(closingDate.getTime())) {
        return res.status(400).json({ message: "Μη έγκυρη ημερομηνία λήξης ψηφοφορίας." });
      }
      if (closingDate < new Date()) {
        return res.status(400).json({ message: "Η ημερομηνία λήξης πρέπει να είναι στο μέλλον." });
      }
      pollData.voteClosingDate = closingDate;
    }
    if (restrictToLocation !== undefined) {
      pollData.restrictToLocation = Boolean(restrictToLocation);
    }

    // Validate incompatible combinations
    if (pollData.restrictToLocation && shouldHideResponders) {
      return res.status(400).json({ 
        message: "Δεν είναι δυνατός ο περιορισμός τοποθεσίας με ανώνυμη συμμετοχή επειδή δεν μπορούμε να επαληθεύσουμε την τοποθεσία ανώνυμων χρηστών." 
      });
    }

    const createdPoll = await Poll.create(pollData);

    const populatedPoll = await createdPoll.populate("createdBy", "displayName username email");

    return res.status(201).json({ poll: await serializePoll(populatedPoll, req.user, req.session, req) });
  } catch (error) {
    console.error("[polls-create-error]", error);
    return res.status(500).json({ message: "Δεν ήταν δυνατή η δημιουργία ψηφοφορίας." });
  }
});

pollsRouter.post("/:pollId/vote", async (req, res) => {
  const { pollId } = req.params;
  const { optionId } = req.body || {};
  const userId = req.user?.id;
  const normalizedOptionId = typeof optionId === "string" ? optionId : String(optionId || "");

  if (!mongoose.Types.ObjectId.isValid(pollId)) {
    return res.status(400).json({ message: "Μη έγκυρη ψηφοφορία." });
  }

  if (!normalizedOptionId || !mongoose.Types.ObjectId.isValid(normalizedOptionId)) {
    return res.status(400).json({ message: "Επιλέξτε μία από τις διαθέσιμες απαντήσεις." });
  }

  try {
    const poll = await Poll.findById(pollId).populate("createdBy", "displayName username email");

    if (!poll) {
      return res.status(404).json({ message: "Η ψηφοφορία δεν βρέθηκε." });
    }

    // Check location restriction if enabled
    if (poll.restrictToLocation) {
      // For anonymous responses, we cannot check user location
      if (poll.anonymousResponses) {
        return res.status(400).json({ 
          message: "Δεν είναι δυνατή η ψηφοφορία σε αυτή την ψηφοφορία με ανώνυμη συμμετοχή επειδή απαιτείται συγκεκριμένη τοποθεσία." 
        });
      }
      
      // For authenticated users, check their location
      if (!req.user) {
        return res.status(401).json({ message: "Χρειάζεται σύνδεση για να ψηφίσετε σε αυτή την ψηφοφορία." });
      }

      const user = await User.findById(req.user.id);
      if (!user) {
        return res.status(401).json({ message: "Ο χρήστης δεν βρέθηκε." });
      }

      // Check location hierarchy: country -> jurisdiction -> city
      let locationMatches = false;
      
      if (poll.locationCountry) {
        // New location hierarchy
        if (poll.locationCity) {
          // All three levels specified - must match exactly (and must not be empty/null)
          locationMatches = poll.locationCountry && user.locationCountry === poll.locationCountry &&
                          poll.locationJurisdiction && user.locationJurisdiction === poll.locationJurisdiction &&
                          poll.locationCity && user.locationCity === poll.locationCity;
        } else if (poll.locationJurisdiction) {
          // Country and jurisdiction specified (and must not be empty/null)
          locationMatches = poll.locationCountry && user.locationCountry === poll.locationCountry &&
                          poll.locationJurisdiction && user.locationJurisdiction === poll.locationJurisdiction;
        } else {
          // Only country specified (and must not be empty/null)
          locationMatches = poll.locationCountry && user.locationCountry === poll.locationCountry;
        }
      } else if (poll.region) {
        // Legacy location fields
        if (poll.cityOrVillage) {
          locationMatches = poll.region && user.region === poll.region && 
                          poll.cityOrVillage && user.cityOrVillage === poll.cityOrVillage;
        } else {
          locationMatches = poll.region && user.region === poll.region;
        }
      }

      if (!locationMatches) {
        let locationDescription = "";
        if (poll.locationCountry) {
          const country = COUNTRIES.find(c => c.value === poll.locationCountry);
          locationDescription = country?.label || poll.locationCountry;
          if (poll.locationJurisdiction) {
            locationDescription += `, ${poll.locationJurisdiction}`;
            if (poll.locationCity) {
              locationDescription += `, ${poll.locationCity}`;
            }
          }
        } else if (poll.region) {
          locationDescription = poll.region;
          if (poll.cityOrVillage) {
            locationDescription += `, ${poll.cityOrVillage}`;
          }
        }
        
        return res.status(403).json({ 
          message: `Αυτή η ψηφοφορία είναι διαθέσιμη μόνο για χρήστες από ${locationDescription}.` 
        });
      }
    }

    // Check if option exists
    const selectedOption = poll.options.id(normalizedOptionId) ||
      poll.options.find((option) => option._id?.toString() === normalizedOptionId);

    if (!selectedOption) {
      return res.status(400).json({ message: "Μη έγκυρη επιλογή ψηφοφορίας." });
    }

    if (poll.anonymousResponses) {
      // Anonymous voting logic - requires BOTH sessionId AND ipAddress for security
      const sessionId = req.session?.id;
      const ipAddress = req.ip;
      const userAgent = req.get("user-agent");

      // Validate that we have both sessionId and ipAddress for secure tracking
      if (!sessionId || !ipAddress) {
        return res.status(400).json({ 
          message: "Για την ασφάλεια της ψηφοφορίας, απαιτείται σύνδεση από πλήρως αναγνωρισμένη συσκευή." 
        });
      }

      // Check if user has already voted (requires BOTH session AND IP to match)
      const existingVote = await AnonymousVote.findOne({
        pollId: poll._id,
        sessionId,
        ipAddress,
      });

      if (existingVote) {
        const oldOptionId = existingVote.optionId.toString();
        
        // If voting for the same option, just return current state
        if (oldOptionId === normalizedOptionId) {
          return res.json({ poll: await serializePoll(poll, req.user, req.session, req) });
        }

        // Change vote: decrement old option, increment new option
        const oldOption = poll.options.id(oldOptionId);
        if (oldOption && oldOption.votes > 0) {
          oldOption.votes -= 1;
        }
        
        selectedOption.votes += 1;
        
        // Update the anonymous vote record
        existingVote.optionId = normalizedOptionId;
        existingVote.userAgent = userAgent;
        
        await existingVote.save();
        await poll.save();
        
        return res.json({ poll: await serializePoll(poll, req.user, req.session, req) });
      }

      // New vote
      selectedOption.votes += 1;

      await AnonymousVote.create({
        pollId: poll._id,
        optionId: normalizedOptionId,
        sessionId,
        ipAddress,
        userAgent,
      });

      await poll.save();
      return res.json({ poll: await serializePoll(poll, req.user, req.session, req) });
    } else {
      // Logged-in voting logic
      if (!userId) {
        return res.status(401).json({ message: "Χρειάζεται σύνδεση για να ψηφίσετε." });
      }

      // Check if user has already voted
      const userVotes = poll.userVotes || [];
      const existingVoteIndex = userVotes.findIndex((uv) => uv.userId.toString() === userId);

      if (existingVoteIndex !== -1) {
        const existingVote = userVotes[existingVoteIndex];
        const oldOptionId = existingVote.optionId.toString();
        
        // If voting for the same option, just return current state
        if (oldOptionId === normalizedOptionId) {
          return res.json({ poll: await serializePoll(poll, req.user, req.session, req) });
        }

        // Change vote: decrement old option, increment new option
        const oldOption = poll.options.id(oldOptionId);
        if (oldOption && oldOption.votes > 0) {
          oldOption.votes -= 1;
        }
        
        selectedOption.votes += 1;
        
        // Update the user vote record
        userVotes[existingVoteIndex].optionId = normalizedOptionId;
        poll.userVotes = userVotes;
        
        await poll.save();
        return res.json({ poll: await serializePoll(poll, req.user, req.session, req) });
      }

      // New vote
      selectedOption.votes += 1;
      
      // Add to userVotes array
      if (!poll.userVotes) {
        poll.userVotes = [];
      }
      poll.userVotes.push({
        userId: req.user._id,
        optionId: normalizedOptionId,
      });
      
      // Maintain backwards compatibility with votedUsers
      if (!poll.votedUsers.some((uid) => uid.toString() === userId)) {
        poll.votedUsers.push(req.user._id);
      }

      await poll.save();
      return res.json({ poll: await serializePoll(poll, req.user, req.session, req) });
    }
  } catch (error) {
    console.error("[polls-vote-error]", error);
    return res.status(500).json({ message: "Δεν ήταν δυνατή η καταχώρηση της ψήφου." });
  }
});

pollsRouter.delete("/:pollId/vote", async (req, res) => {
  const { pollId } = req.params;
  const userId = req.user?.id;

  if (!mongoose.Types.ObjectId.isValid(pollId)) {
    return res.status(400).json({ message: "Μη έγκυρη ψηφοφορία." });
  }

  try {
    const poll = await Poll.findById(pollId).populate("createdBy", "displayName username email");

    if (!poll) {
      return res.status(404).json({ message: "Η ψηφοφορία δεν βρέθηκε." });
    }

    if (poll.anonymousResponses) {
      // Anonymous vote cancellation - requires BOTH sessionId AND ipAddress
      const sessionId = req.session?.id;
      const ipAddress = req.ip;

      // Validate that we have both sessionId and ipAddress
      if (!sessionId || !ipAddress) {
        return res.status(400).json({ 
          message: "Δεν είναι δυνατή η ακύρωση της ψήφου από αυτή τη συσκευή." 
        });
      }

      // Check if user has voted (requires BOTH session AND IP to match)
      const existingVote = await AnonymousVote.findOne({
        pollId: poll._id,
        sessionId,
        ipAddress,
      });

      if (!existingVote) {
        return res.status(400).json({ message: "Δεν έχετε ψηφίσει σε αυτή την ψηφοφορία." });
      }

      // Decrement the vote count
      const votedOptionId = existingVote.optionId.toString();
      const votedOption = poll.options.id(votedOptionId);
      
      if (votedOption && votedOption.votes > 0) {
        votedOption.votes -= 1;
      }

      // Remove the anonymous vote record
      await AnonymousVote.deleteOne({ _id: existingVote._id });
      await poll.save();

      return res.json({ poll: await serializePoll(poll, req.user, req.session, req) });
    } else {
      // Logged-in vote cancellation
      if (!userId) {
        return res.status(401).json({ message: "Χρειάζεται σύνδεση για να ακυρώσετε την ψήφο σας." });
      }

      const userVotes = poll.userVotes || [];
      const existingVoteIndex = userVotes.findIndex((uv) => uv.userId.toString() === userId);

      if (existingVoteIndex === -1) {
        return res.status(400).json({ message: "Δεν έχετε ψηφίσει σε αυτή την ψηφοφορία." });
      }

      const existingVote = userVotes[existingVoteIndex];
      const votedOptionId = existingVote.optionId.toString();
      
      // Decrement the vote count
      const votedOption = poll.options.id(votedOptionId);
      if (votedOption && votedOption.votes > 0) {
        votedOption.votes -= 1;
      }

      // Remove from userVotes
      userVotes.splice(existingVoteIndex, 1);
      poll.userVotes = userVotes;
      
      // Also remove from votedUsers for backwards compatibility
      const votedUserIndex = poll.votedUsers.findIndex((uid) => uid.toString() === userId);
      if (votedUserIndex !== -1) {
        poll.votedUsers.splice(votedUserIndex, 1);
      }

      await poll.save();
      return res.json({ poll: await serializePoll(poll, req.user, req.session, req) });
    }
  } catch (error) {
    console.error("[polls-cancel-vote-error]", error);
    return res.status(500).json({ message: "Δεν ήταν δυνατή η ακύρωση της ψήφου." });
  }
});

// Get poll statistics
pollsRouter.get("/:pollId/statistics", async (req, res) => {
  const { pollId } = req.params;

  if (!mongoose.Types.ObjectId.isValid(pollId)) {
    return res.status(400).json({ message: "Μη έγκυρη ψηφοφορία." });
  }

  try {
    const poll = await Poll.findById(pollId).populate("createdBy", "displayName username email");

    if (!poll) {
      return res.status(404).json({ message: "Η ψηφοφορία δεν βρέθηκε." });
    }

    // If the poll has anonymous responses, we cannot provide detailed statistics
    if (poll.anonymousResponses) {
      return res.json({
        statistics: {
          totalVotes: poll.options.reduce((sum, opt) => sum + (opt.votes || 0), 0),
          byUser: [],
          byGender: {},
          message: "Οι λεπτομερείς στατιστικές δεν είναι διαθέσιμες για ανώνυμες ψηφοφορίες."
        }
      });
    }

    // Get all users who voted (from userVotes array)
    const userIds = (poll.userVotes || []).map(uv => uv.userId);
    const votedUsers = await User.find({ _id: { $in: userIds } }).select("displayName username email gender");

    // Build statistics by user
    const byUser = poll.userVotes.map(uv => {
      const user = votedUsers.find(u => u._id.toString() === uv.userId.toString());
      const option = poll.options.id(uv.optionId);
      return {
        user: {
          displayName: user?.displayName || "Unknown",
          username: user?.username,
          email: user?.email
        },
        option: option?.text || "Unknown option"
      };
    });

    // Build statistics by gender
    const byGender = {};
    poll.options.forEach(option => {
      byGender[option.text] = {
        male: 0,
        female: 0,
        other: 0,
        prefer_not_to_say: 0,
        unknown: 0
      };
    });

    poll.userVotes.forEach(uv => {
      const user = votedUsers.find(u => u._id.toString() === uv.userId.toString());
      const option = poll.options.id(uv.optionId);
      if (option) {
        const gender = user?.gender || "unknown";
        byGender[option.text][gender] = (byGender[option.text][gender] || 0) + 1;
      }
    });

    return res.json({
      statistics: {
        totalVotes: poll.options.reduce((sum, opt) => sum + (opt.votes || 0), 0),
        byUser,
        byGender
      }
    });
  } catch (error) {
    console.error("[polls-statistics-error]", error);
    return res.status(500).json({ message: "Δεν ήταν δυνατή η ανάκτηση στατιστικών." });
  }
});

// Delete a poll (only by creator or admin)
pollsRouter.delete("/:pollId", ensureAuthenticated, async (req, res) => {
  const { pollId } = req.params;
  const userId = req.user?.id;

  if (!mongoose.Types.ObjectId.isValid(pollId)) {
    return res.status(400).json({ message: "Μη έγκυρη ψηφοφορία." });
  }

  try {
    const poll = await Poll.findById(pollId);

    if (!poll) {
      return res.status(404).json({ message: "Η ψηφοφορία δεν βρέθηκε." });
    }

    // Check if user is the creator or admin
    const isCreator = poll.createdBy && poll.createdBy.toString() === userId;
    const isAdmin = req.user.role === "admin";

    if (!isCreator && !isAdmin) {
      return res.status(403).json({ message: "Δεν έχετε δικαίωμα να διαγράψετε αυτή την ψηφοφορία." });
    }

    // Delete associated anonymous votes if any
    if (poll.anonymousResponses) {
      await AnonymousVote.deleteMany({ pollId: poll._id });
    }

    await Poll.deleteOne({ _id: poll._id });

    return res.json({ message: "Η ψηφοφορία διαγράφηκε επιτυχώς." });
  } catch (error) {
    console.error("[polls-delete-error]", error);
    return res.status(500).json({ message: "Δεν ήταν δυνατή η διαγραφή της ψηφοφορίας." });
  }
});

// Add option to poll (user-submitted)
pollsRouter.post("/:pollId/options", async (req, res) => {
  const { pollId } = req.params;
  const { option } = req.body || {};

  if (!mongoose.Types.ObjectId.isValid(pollId)) {
    return res.status(400).json({ message: "Μη έγκυρη ψηφοφορία." });
  }

  try {
    const poll = await Poll.findById(pollId);

    if (!poll) {
      return res.status(404).json({ message: "Η ψηφοφορία δεν βρέθηκε." });
    }

    if (!poll.allowUserOptions) {
      return res.status(403).json({ message: "Αυτή η ψηφοφορία δεν επιτρέπει προσθήκη επιλογών από χρήστες." });
    }

    // Check if user is authenticated (unless anonymous responses are allowed)
    const userId = req.user?.id;
    if (!poll.anonymousResponses && !userId) {
      return res.status(401).json({ message: "Απαιτείται σύνδεση για να προσθέσετε επιλογή." });
    }

    // Validate option
    if (!option || typeof option !== "object") {
      return res.status(400).json({ message: "Μη έγκυρη επιλογή." });
    }

    const optionText = option.text?.trim();
    if (!optionText) {
      return res.status(400).json({ message: "Το κείμενο της επιλογής είναι υποχρεωτικό." });
    }

    // Check for duplicate text
    const isDuplicate = poll.options.some((opt) => opt.text === optionText);
    if (isDuplicate) {
      return res.status(400).json({ message: "Η επιλογή υπάρχει ήδη." });
    }

    // Validate people mode option if needed
    if (poll.optionsArePeople) {
      const { validatePeopleOption } = await import("./utils/pollValidation.js");
      const validation = validatePeopleOption(option, poll.linkPolicy);
      if (!validation.valid) {
        return res.status(400).json({ message: validation.error });
      }
    }

    // Determine status based on approval mode
    const status = poll.userOptionApproval === "creator" ? "pending" : "approved";

    // Create new option
    const newOption = {
      text: optionText,
      votes: 0,
      status,
      createdBy: userId || null,
    };

    // Add people mode fields if applicable
    if (poll.optionsArePeople) {
      newOption.photoUrl = option.photoUrl?.trim() || "";
      newOption.photo = option.photo || "";
      newOption.profileUrl = option.profileUrl?.trim() || "";
    }

    poll.options.push(newOption);
    await poll.save();

    // Populate and serialize
    await poll.populate("createdBy", "displayName username email");
    const serialized = await serializePoll(poll, req.user, req.session, req);

    return res.status(201).json({ 
      poll: serialized,
      message: status === "pending" 
        ? "Η επιλογή σας υποβλήθηκε και εκκρεμεί έγκριση." 
        : "Η επιλογή προστέθηκε επιτυχώς."
    });
  } catch (error) {
    console.error("[add-option-error]", error);
    return res.status(500).json({ message: "Δεν ήταν δυνατή η προσθήκη της επιλογής." });
  }
});

// Get pending options (creator/admin only)
pollsRouter.get("/:pollId/options/pending", ensureAuthenticated, async (req, res) => {
  const { pollId } = req.params;

  if (!mongoose.Types.ObjectId.isValid(pollId)) {
    return res.status(400).json({ message: "Μη έγκυρη ψηφοφορία." });
  }

  try {
    const poll = await Poll.findById(pollId).populate("createdBy", "displayName username email");

    if (!poll) {
      return res.status(404).json({ message: "Η ψηφοφορία δεν βρέθηκε." });
    }

    const userId = req.user?.id;
    const isCreator = poll.createdBy && poll.createdBy._id.toString() === userId;
    const isAdmin = req.user.role === "admin";

    if (!isCreator && !isAdmin) {
      return res.status(403).json({ message: "Δεν έχετε δικαίωμα πρόσβασης σε αυτό το περιεχόμενο." });
    }

    const pendingOptions = poll.options
      .filter((opt) => opt.status === "pending")
      .map((opt) => ({
        id: opt._id.toString(),
        text: opt.text,
        createdBy: opt.createdBy ? serializeAuthor(opt.createdBy) : null,
        photoUrl: opt.photoUrl,
        photo: opt.photo,
        profileUrl: opt.profileUrl,
      }));

    return res.json({ options: pendingOptions });
  } catch (error) {
    console.error("[pending-options-error]", error);
    return res.status(500).json({ message: "Δεν ήταν δυνατή η ανάκτηση των εκκρεμών επιλογών." });
  }
});

// Approve pending option (creator/admin only)
pollsRouter.post("/:pollId/options/:optionId/approve", ensureAuthenticated, async (req, res) => {
  const { pollId, optionId } = req.params;

  if (!mongoose.Types.ObjectId.isValid(pollId) || !mongoose.Types.ObjectId.isValid(optionId)) {
    return res.status(400).json({ message: "Μη έγκυρο αναγνωριστικό." });
  }

  try {
    const poll = await Poll.findById(pollId).populate("createdBy", "displayName username email");

    if (!poll) {
      return res.status(404).json({ message: "Η ψηφοφορία δεν βρέθηκε." });
    }

    const userId = req.user?.id;
    const isCreator = poll.createdBy && poll.createdBy._id.toString() === userId;
    const isAdmin = req.user.role === "admin";

    if (!isCreator && !isAdmin) {
      return res.status(403).json({ message: "Δεν έχετε δικαίωμα να εγκρίνετε επιλογές." });
    }

    const option = poll.options.id(optionId);
    if (!option) {
      return res.status(404).json({ message: "Η επιλογή δεν βρέθηκε." });
    }

    if (option.status !== "pending") {
      return res.status(400).json({ message: "Η επιλογή έχει ήδη εγκριθεί." });
    }

    option.status = "approved";
    await poll.save();

    const serialized = await serializePoll(poll, req.user, req.session, req);
    return res.json({ poll: serialized, message: "Η επιλογή εγκρίθηκε επιτυχώς." });
  } catch (error) {
    console.error("[approve-option-error]", error);
    return res.status(500).json({ message: "Δεν ήταν δυνατή η έγκριση της επιλογής." });
  }
});

// Delete option (creator/admin only)
pollsRouter.delete("/:pollId/options/:optionId", ensureAuthenticated, async (req, res) => {
  const { pollId, optionId } = req.params;

  if (!mongoose.Types.ObjectId.isValid(pollId) || !mongoose.Types.ObjectId.isValid(optionId)) {
    return res.status(400).json({ message: "Μη έγκυρο αναγνωριστικό." });
  }

  try {
    const poll = await Poll.findById(pollId).populate("createdBy", "displayName username email");

    if (!poll) {
      return res.status(404).json({ message: "Η ψηφοφορία δεν βρέθηκε." });
    }

    const userId = req.user?.id;
    const isCreator = poll.createdBy && poll.createdBy._id.toString() === userId;
    const isAdmin = req.user.role === "admin";

    if (!isCreator && !isAdmin) {
      return res.status(403).json({ message: "Δεν έχετε δικαίωμα να διαγράψετε επιλογές." });
    }

    const option = poll.options.id(optionId);
    if (!option) {
      return res.status(404).json({ message: "Η επιλογή δεν βρέθηκε." });
    }

    // Remove the option
    poll.options.pull(optionId);
    
    // Also remove any votes for this option
    poll.userVotes = poll.userVotes.filter(
      (vote) => vote.optionId.toString() !== optionId
    );

    await poll.save();

    const serialized = await serializePoll(poll, req.user, req.session, req);
    return res.json({ poll: serialized, message: "Η επιλογή διαγράφηκε επιτυχώς." });
  } catch (error) {
    console.error("[delete-option-error]", error);
    return res.status(500).json({ message: "Δεν ήταν δυνατή η διαγραφή της επιλογής." });
  }
});

const publicUsersRouter = express.Router();

// Get list of visible users (authenticated users only)
publicUsersRouter.get("/visible", ensureAuthenticated, async (req, res) => {
  try {
    const users = await User.find({ visibleToOtherUsers: true })
      .sort({ createdAt: -1 })
      .limit(200)
      .select("displayName firstName lastName username avatar occupation region cityOrVillage createdAt");

    // Serialize users without exposing sensitive info
    const visibleUsers = users.map((user) => ({
      id: user.id,
      displayName: user.displayName,
      firstName: user.firstName,
      lastName: user.lastName,
      username: user.username,
      avatar: user.avatar,
      occupation: user.occupation,
      region: user.region,
      cityOrVillage: user.cityOrVillage,
      createdAt: user.createdAt,
    }));

    return res.json({ users: visibleUsers });
  } catch (error) {
    console.error("[visible-users-list-error]", error);
    return res.status(500).json({ message: "Δεν ήταν δυνατή η ανάκτηση χρηστών." });
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
  const allowedRoles = ["user", "reporter", "editor", "admin"];

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

authRouter.post("/register", ensureDatabaseReady, async (req, res) => {
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
    if (error?.code === 11000) {
      return res.status(409).json({ message: "Το email χρησιμοποιείται ήδη." });
    }
    console.error("[register-error]", error);
    return res.status(500).json({ message: "Κάτι πήγε στραβά. Προσπαθήστε ξανά." });
  }
});

authRouter.post("/login", ensureDatabaseReady, async (req, res) => {
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

    if (needsPasswordUpgrade(user.password)) {
      try {
        user.password = hashPassword(password);
        await user.save();
      } catch (error) {
        console.warn("[login-password-upgrade-error]", error);
      }
    }

    req.login(user, (error) => {
      if (error) {
        return res.status(500).json({ message: "Η δημιουργία συνεδρίας απέτυχε." });
      }
      return res.json({ user: sanitizeUser(user) });
    });
  } catch (error) {
    console.error("[login-error]", error);
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
    "occupation",
    "gender",
    "avatar",
    "visibleToOtherUsers",
    // New location hierarchy
    "locationCountry",
    "locationJurisdiction",
    "locationCity",
    // Legacy location fields for backward compatibility
    "country",
    "region",
    "cityOrVillage",
  ];
  const updates = {};

  for (const field of allowedFields) {
    if (field in req.body) {
      const rawValue = req.body[field];
      if (field === "avatar") {
        if (rawValue === null || rawValue === "") {
          updates.avatar = undefined;
        } else if (typeof rawValue === "string") {
          const match = rawValue.match(/^data:(image\/(?:jpeg|png|webp));base64,([A-Za-z0-9+/=]+)$/);
          if (!match) {
            return res.status(400).json({ message: "Η φωτογραφία πρέπει να είναι JPG, PNG ή WebP." });
          }
          const imageBuffer = Buffer.from(match[2], "base64");
          const maxAvatarBytes = 320 * 1024;
          if (imageBuffer.length > maxAvatarBytes) {
            return res.status(400).json({ message: "Η φωτογραφία προφίλ είναι πολύ μεγάλη." });
          }
          updates.avatar = rawValue;
        } else {
          return res.status(400).json({ message: "Η φωτογραφία προφίλ δεν είναι έγκυρη." });
        }
      } else {
        const trimmedValue = typeof rawValue === "string" ? rawValue.trim() : rawValue;
        updates[field] = trimmedValue || undefined;
      }
    }
  }

  if (updates.username) {
    const existingUser = await User.findOne({ username: updates.username, _id: { $ne: req.user._id } });
    if (existingUser) {
      return res.status(409).json({ message: "Το username χρησιμοποιείται ήδη." });
    }
  }

  // Validate new location hierarchy
  if ("locationCountry" in updates || "locationJurisdiction" in updates || "locationCity" in updates) {
    const currentCountry = updates.locationCountry ?? req.user.locationCountry;
    const currentJurisdiction = updates.locationJurisdiction ?? req.user.locationJurisdiction;
    const currentCity = updates.locationCity ?? req.user.locationCity;
    
    const locationValidation = validateLocationHierarchy(currentCountry, currentJurisdiction, currentCity);
    if (!locationValidation.valid) {
      return res.status(400).json({ message: locationValidation.error });
    }
    
    // Clear child fields if parent is cleared
    if ("locationCountry" in updates && !updates.locationCountry) {
      updates.locationJurisdiction = undefined;
      updates.locationCity = undefined;
    }
    if ("locationJurisdiction" in updates && !updates.locationJurisdiction) {
      updates.locationCity = undefined;
    }
  }

  // Validate legacy location fields for backward compatibility
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

  if ("gender" in updates && updates.gender) {
    const validGenders = ["male", "female", "other", "prefer_not_to_say"];
    if (!validGenders.includes(updates.gender)) {
      return res.status(400).json({ message: "Το φύλο δεν είναι έγκυρο." });
    }
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

authRouter.get(
  "/github",
  ensureProviderConfigured("github"),
  passport.authenticate("github", { scope: ["user:email"] })
);

authRouter.get(
  "/github/callback",
  ensureProviderConfigured("github"),
  passport.authenticate("github", {
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
app.use("/api/news", newsRouter);
app.use("/api/articles", articlesRouter);
app.use("/api/polls", pollsRouter);
app.use("/api/public-users", publicUsersRouter);
app.use("/api/users", usersRouter);
app.use("/contact", contactRouter);
app.use("/api/contact", contactRouter);

authRouter.get("/debug-sentry", function mainHandler(req, res) {
  throw new Error("Sentry Test Error!");
});

const PORT = process.env.PORT || 5000;
const HOST = "127.0.0.1";

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
