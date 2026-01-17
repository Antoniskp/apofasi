import mongoose from "mongoose";

const userSchema = new mongoose.Schema(
  {
    provider: {
      type: String,
      enum: ["local", "google", "facebook", "github"],
      default: "local"
    },
    providerId: {
      type: String,
      sparse: true
    },
    displayName: {
      type: String,
      trim: true
    },
    firstName: {
      type: String,
      trim: true,
    },
    lastName: {
      type: String,
      trim: true,
    },
    mobile: {
      type: String,
      trim: true
    },
    occupation: {
      type: String,
      trim: true
    },
    // Location hierarchy
    locationCountry: {
      type: String,
      trim: true,
    },
    locationJurisdiction: {
      type: String,
      trim: true,
    },
    locationCity: {
      type: String,
      trim: true,
    },
    // Legacy fields for backward compatibility
    country: {
      type: String,
      trim: true
    },
    region: {
      type: String,
      trim: true,
    },
    cityOrVillage: {
      type: String,
      trim: true,
    },
    gender: {
      type: String,
      enum: ["male", "female", "other", "prefer_not_to_say"],
      trim: true,
    },
    username: {
      type: String,
      trim: true,
      unique: true,
      sparse: true
    },
    email: {
      type: String,
      unique: true,
      sparse: true,
      lowercase: true
    },
    password: {
      type: String
    },
    avatar: {
      type: String
    },
    role: {
      type: String,
      enum: ["user", "reporter", "editor", "admin"],
      default: "user"
    },
    visibleToOtherUsers: {
      type: Boolean,
      default: false
    }
  },
  { timestamps: true }
);

userSchema.index({ provider: 1, providerId: 1 }, { unique: true, sparse: true });

export default mongoose.model("User", userSchema);
