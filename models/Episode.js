const mongoose = require("mongoose");

const EpisodeSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: true,
    },
    desc: {
      type: String,
      required: true,
    },
    thumbnail: {
      type: String,
    },
    creator: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },
    type: {
      type: String,
      enum: ["audio", "video"],
      default: "audio",
    },
    duration: {
      type: String,
    },
    file: {
      type: String,
    },
    public_id: { type: String },
    podcast: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "Podcast",
        required: true,
      },
  
  },
  {
    timestamps: true,
  }
);

module.exports = mongoose.model("Episode", EpisodeSchema);
