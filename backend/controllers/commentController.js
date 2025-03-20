const Comment = require("../models/Comment");

exports.addComment = async (req, res) => {
  try {
    const { pdfId, text, parentComment } = req.body;
    const userIdentifier = req.user ? req.user.email : req.body.email; // Handle invited users

    const comment = new Comment({
      pdf: pdfId,
      user: userIdentifier,
      text,
      parentComment,
    });
    await comment.save();

    res.status(201).json({ message: "Comment added successfully", comment });
  } catch (error) {
    res.status(500).json({ message: "Server Error", error });
  }
};

exports.getComments = async (req, res) => {
  try {
    const { pdfId } = req.params;
    const comments = await Comment.find({ pdf: pdfId })
      .populate("parentComment")
      .sort({ createdAt: -1 });

    res.json(comments);
  } catch (error) {
    res.status(500).json({ message: "Server Error", error });
  }
};
