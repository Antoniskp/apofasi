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
        },
        createdBy: {
          type: mongoose.Schema.Types.ObjectId,
          ref: "User"
        },
        status: {
          type: String,
          enum: ["approved", "pending"],
          default: "approved"
        },
        photoUrl: {
          type: String,
          trim: true,
        },
        photo: {
          type: String,
        },
        profileUrl: {
          type: String,
          trim: true,
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
    allowUserOptions: {
      type: Boolean,
      default: false,
    },
    userOptionApproval: {
      type: String,
      enum: ["auto", "creator"],
      default: "auto"
    },
    optionsArePeople: {
      type: Boolean,
      default: false,
    },
    linkPolicy: {
      mode: {
        type: String,
        enum: ["any", "allowlist"],
        default: "any"
      },
      allowedDomains: {
        type: [String],
        default: []
      }
    },
    voteClosingDate: {
      type: Date,
      default: null,
    },
    restrictToLocation: {
      type: Boolean,
      default: false,
    },
  },
  { timestamps: true }
);

export default mongoose.model("Poll", pollSchema);
