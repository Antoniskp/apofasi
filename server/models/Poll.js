import mongoose from "mongoose";

const pollSchema = new mongoose.Schema(
  {
    question: {
      type: String,
      required: true
    },
    options: [
      {
        text: {
          type: String,
          required: true,
          trim: true,
        },
        votes: {
          type: Number,
          default: 0
        }
      }
    ],
    votedUsers: [
      {
        type: mongoose.Schema.Types.ObjectId,
        ref: "User"
      }
    ],
    userVotes: [
      {
        userId: {
          type: mongoose.Schema.Types.ObjectId,
          ref: "User",
          required: true,
        },
        optionId: {
          type: mongoose.Schema.Types.ObjectId,
          required: true,
        },
      }
    ],
    createdBy: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User"
    },
    tags: {
      type: [String],
      default: [],
      set: (tags) =>
        Array.from(
          new Set(
            (tags || [])
              .map((tag) => (typeof tag === "string" ? tag.trim() : ""))
              .filter(Boolean)
          )
        ),
    },
    region: {
      type: String,
      trim: true,
    },
    cityOrVillage: {
      type: String,
      trim: true,
    },
    isAnonymousCreator: {
      type: Boolean,
      default: false,
    },
    anonymousResponses: {
      type: Boolean,
      default: false,
    },
  },
  { timestamps: true }
);

export default mongoose.model("Poll", pollSchema);
