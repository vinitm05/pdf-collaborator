const express = require("express");
const connectDB = require("./config/db");
const dotenv = require("dotenv");
const cors = require("cors");

dotenv.config();
connectDB();

const app = express();

app.use(cors({ origin: "*", credentials: true }));

app.use(express.json());

app.use("/api/pdf", require("./routes/pdfRoutes"));
app.use("/api/comments", require("./routes/commentRoutes"));
app.use("/api/auth", require("./routes/authRoutes"));

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => console.log(`Server running on port ${PORT}`));
