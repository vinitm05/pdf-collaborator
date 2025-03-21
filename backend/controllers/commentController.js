const Comment = require("../models/Comment");

const sanitizeText = (text) => {
  return text.trim().slice(0, 1000); // Limit comment length
};

exports.addComment = async (req, res) => {
  try {
    const { pdfId, text, parentComment } = req.body;

    if (!pdfId || !text?.trim()) {
      return res.status(400).json({ message: "PDF ID and text are required" });
    }

    const sanitizedText = sanitizeText(text);
    const userIdentifier = req.user?.email || req.body.email || "Anonymous";

    const comment = new Comment({
      pdf: pdfId,
      user: userIdentifier,
      text: sanitizedText,
      parentComment: parentComment || null,
    });

    await comment.save();

    // ✅ Populate the parent comment if it's a reply
    const populatedComment = await Comment.findById(comment._id).populate(
      "parentComment"
    );

    res.status(201).json({
      message: "Comment added successfully",
      comment: populatedComment,
    });
  } catch (error) {
    console.error("Error adding comment:", error);
    res.status(500).json({ message: "Server Error", error });
  }
};

exports.getComments = async (req, res) => {
  try {
    const { pdfId } = req.params;

    if (!pdfId.match(/^[0-9a-fA-F]{24}$/)) {
      return res.status(400).json({ message: "Invalid PDF ID format" });
    }

    // ✅ Fetch comments and populate replies
    const comments = await Comment.find({ pdf: pdfId })
      .populate("parentComment")
      .sort({ createdAt: -1 });

    res.json({ comments });
  } catch (error) {
    console.error("Error fetching comments:", error);
    res.status(500).json({ message: "Server Error", error });
  }
};


