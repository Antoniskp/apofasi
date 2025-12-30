import mongoose from "mongoose";

const userSchema = new mongoose.Schema(
  {
    provider: {
      type: String,
      enum: ["local", "google", "facebook"],
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
    country: {
      type: String,
      trim: true
    },
    occupation: {
      type: String,
      trim: true
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
      enum: ["user", "reporter", "admin"],
      default: "user"
    }
  },
  { timestamps: true }
);

userSchema.index({ provider: 1, providerId: 1 }, { unique: true, sparse: true });

export default mongoose.model("User", userSchema);
