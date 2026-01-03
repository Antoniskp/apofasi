import mongoose from "mongoose";

const ContactMessageSchema = new mongoose.Schema(
  {
    name: { type: String, trim: true },
    email: { type: String, trim: true, lowercase: true, required: true },
    topic: { type: String, trim: true, default: "general" },
    message: { type: String, trim: true, required: true },
    user: { type: mongoose.Schema.Types.ObjectId, ref: "User" },
    userSnapshot: {
      id: String,
      displayName: String,
      email: String,
      username: String,
      provider: String,
      role: String,
    },
    ipAddress: { type: String, trim: true },
    userAgent: { type: String, trim: true },
    referrer: { type: String, trim: true },
    status: {
      type: String,
      enum: ["open", "reviewed", "closed"],
      default: "open",
    },
  },
  { timestamps: true }
);

export default mongoose.model("ContactMessage", ContactMessageSchema);
