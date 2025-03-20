const mongoose = require("mongoose");

const CommentSchema = new mongoose.Schema({
  pdf: { type: mongoose.Schema.Types.ObjectId, ref: "PDF", required: true },
  user: { type: String, required: true }, // Can be email or user ID
  text: { type: String, required: true },
  parentComment: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "Comment",
    default: null,
  },
  createdAt: { type: Date, default: Date.now },
});

module.exports = mongoose.model("Comment", CommentSchema);
