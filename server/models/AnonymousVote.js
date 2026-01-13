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
      index: true,
    },
    ipAddress: {
      type: String,
      index: true,
    },
  },
  { timestamps: true }
);

// Compound index for efficient lookups
anonymousVoteSchema.index({ pollId: 1, sessionId: 1 });
anonymousVoteSchema.index({ pollId: 1, ipAddress: 1 });

export default mongoose.model("AnonymousVote", anonymousVoteSchema);
