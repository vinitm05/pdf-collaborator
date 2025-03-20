const PDF = require("../models/PDF");

exports.uploadPDF = async (req, res) => {
  try {
    if (!req.file) return res.status(400).json({ message: "No file uploaded" });

    const pdf = new PDF({
      user: req.user.id,
      fileName: req.file.originalname,
      fileUrl: req.file.location,
    });

    await pdf.save();
    res.status(201).json({ message: "PDF uploaded successfully", pdf });
  } catch (error) {
    res.status(500).json({ message: "Server Error", error });
  }
};

exports.getUserPDFs = async (req, res) => {
  try {
    const pdfs = await PDF.find({ user: req.user.id }).sort({ createdAt: -1 });
    res.json(pdfs);
  } catch (error) {
    res.status(500).json({ message: "Server Error", error });
  }
};
