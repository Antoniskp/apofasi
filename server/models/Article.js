import mongoose from "mongoose";

const articleSchema = new mongoose.Schema(
  {
    title: {
      type: String,
      required: true,
      trim: true
    },
    content: {
      type: String,
      required: true
    },
    author: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true
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
    isNews: {
      type: Boolean,
      default: false
    },
    taggedAsNewsBy: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User"
    },
    taggedAsNewsAt: {
      type: Date
    }
  },
  { timestamps: true }
);

articleSchema.index({ author: 1, createdAt: -1 });
articleSchema.index({ isNews: 1, createdAt: -1 });
articleSchema.index({ tags: 1 });

export default mongoose.model("Article", articleSchema);
