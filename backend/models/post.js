const mongoose = require("mongoose");
const Schema = mongoose.Schema;

const PostSchema = new Schema({
  title: {
    type: String,
    required: true,
    trim: true,
  },

  description: {
    type: String,
    default: "",
    trim: true,
  },

  resourceType: {
    type: String,
    enum: ["pdf", "youtube", "link"],
    required: true,
  },

  url: {
    type: String,
    required: true,
    trim: true,
  },

  owner: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "User",
    required: true,
  },
  },
  {
    timestamps: true,
  }
)

module.exports = mongoose.model("Post",PostSchema);