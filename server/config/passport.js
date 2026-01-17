import passport from "passport";
import { Strategy as GoogleStrategy } from "passport-google-oauth20";
import { Strategy as FacebookStrategy } from "passport-facebook";
import { Strategy as GitHubStrategy } from "passport-github2";
import User from "../models/User.js";

const createOrUpdateOAuthUser = async ({ provider, profile }) => {
  const email = profile.emails?.[0]?.value;
  const avatar = profile.photos?.[0]?.value;

  const existingUser = await User.findOne({ provider, providerId: profile.id });

  if (existingUser) {
    existingUser.displayName = profile.displayName || existingUser.displayName;
    existingUser.email = existingUser.email || email;
    existingUser.avatar = avatar || existingUser.avatar;
    await existingUser.save();
    return existingUser;
  }

  return User.create({
    provider,
    providerId: profile.id,
    displayName: profile.displayName,
    email,
    avatar,
    username: profile.username
  });
};

const configurePassport = () => {
  const googleEnabled = Boolean(
    process.env.GOOGLE_CLIENT_ID && process.env.GOOGLE_CLIENT_SECRET
  );

  const facebookEnabled = Boolean(
    process.env.FACEBOOK_APP_ID && process.env.FACEBOOK_APP_SECRET
  );

  const githubEnabled = Boolean(
    process.env.GITHUB_CLIENT_ID && process.env.GITHUB_CLIENT_SECRET
  );

  passport.serializeUser((user, done) => {
    done(null, user.id);
  });

  passport.deserializeUser(async (id, done) => {
    try {
      const user = await User.findById(id);
      done(null, user);
    } catch (error) {
      done(error, null);
    }
  });

  if (googleEnabled) {
    passport.use(
      new GoogleStrategy(
        {
          clientID: process.env.GOOGLE_CLIENT_ID,
          clientSecret: process.env.GOOGLE_CLIENT_SECRET,
          callbackURL:
            process.env.GOOGLE_CALLBACK_URL || "/auth/google/callback"
        },
        async (accessToken, refreshToken, profile, done) => {
          try {
            const user = await createOrUpdateOAuthUser({
              provider: "google",
              profile
            });
            done(null, user);
          } catch (error) {
            done(error, null);
          }
        }
      )
    );
  }

  if (facebookEnabled) {
    passport.use(
      new FacebookStrategy(
        {
          clientID: process.env.FACEBOOK_APP_ID,
          clientSecret: process.env.FACEBOOK_APP_SECRET,
          callbackURL:
            process.env.FACEBOOK_CALLBACK_URL || "/auth/facebook/callback",
          profileFields: ["id", "displayName", "photos", "email"]
        },
        async (accessToken, refreshToken, profile, done) => {
          try {
            const user = await createOrUpdateOAuthUser({
              provider: "facebook",
              profile
            });
            done(null, user);
          } catch (error) {
            done(error, null);
          }
        }
      )
    );
  }

  if (githubEnabled) {
    passport.use(
      new GitHubStrategy(
        {
          clientID: process.env.GITHUB_CLIENT_ID,
          clientSecret: process.env.GITHUB_CLIENT_SECRET,
          callbackURL:
            process.env.GITHUB_CALLBACK_URL || "/auth/github/callback"
        },
        async (accessToken, refreshToken, profile, done) => {
          try {
            const user = await createOrUpdateOAuthUser({
              provider: "github",
              profile
            });
            done(null, user);
          } catch (error) {
            done(error, null);
          }
        }
      )
    );
  }
};

export default configurePassport;
