const express = require("express");
const { uploadPDF, getUserPDFs } = require("../controllers/pdfController");
const upload = require("../middleware/uploadMiddleware");
const authMiddleware = require("../middleware/authMiddleware");

const router = express.Router();

router.post("/upload", authMiddleware, upload.single("pdf"), uploadPDF);
router.get("/", authMiddleware, getUserPDFs);

module.exports = router;
