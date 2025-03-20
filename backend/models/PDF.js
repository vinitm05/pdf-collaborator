const mongoose = require("mongoose");

const PDFSchema = new mongoose.Schema({
  user: { type: mongoose.Schema.Types.ObjectId, ref: "User", required: true },
  fileName: { type: String, required: true },
  fileUrl: { type: String, required: true },
  sharedWith: [{ type: String }], // List of invited emails
  shareableLink: { type: String }, // Unique share link
  createdAt: { type: Date, default: Date.now },
});

module.exports = mongoose.model("PDF", PDFSchema);
