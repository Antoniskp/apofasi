import mongoose from "mongoose";

const anonymousVoteSchema = new mongoose.Schema(
  {
    pollId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Poll",
      required: true,
      index: true,
    },
    optionId: {
      type: mongoose.Schema.Types.ObjectId,
      required: true,
    },
    sessionId: {
      type: String,
      required: true,
      index: true,
    },
    ipAddress: {
      type: String,
      required: true,
      index: true,
    },
    userAgent: {
      type: String,
      trim: true,
    },
  },
  { timestamps: true }
);

// Compound index for efficient lookups - now requires BOTH sessionId AND ipAddress
anonymousVoteSchema.index({ pollId: 1, sessionId: 1, ipAddress: 1 }, { unique: true });

export default mongoose.model("AnonymousVote", anonymousVoteSchema);
