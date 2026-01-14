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
      // Not marked as required to maintain backward compatibility
      // but application logic requires it for new votes
      index: true,
    },
    ipAddress: {
      type: String,
      // Not marked as required to maintain backward compatibility
      // but application logic requires it for new votes
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
// Partial index to only apply to documents that have both fields
anonymousVoteSchema.index(
  { pollId: 1, sessionId: 1, ipAddress: 1 }, 
  { 
    unique: true,
    partialFilterExpression: {
      sessionId: { $exists: true, $ne: null },
      ipAddress: { $exists: true, $ne: null }
    }
  }
);

export default mongoose.model("AnonymousVote", anonymousVoteSchema);
