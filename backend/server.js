// backend/server.js
const express = require("express");
const cors = require("cors");
const morgan = require("morgan");
const mongoose = require("mongoose");
const path = require("path");
require("dotenv").config();

const app = express();

// ===== MIDDLEWARE =====
app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(morgan("dev"));
app.use("/uploads", express.static(path.join(__dirname, "uploads")));

// ===== CUSTOM MIDDLEWARE =====
const logActivity = require("./middlewares/logActivity");
app.use(logActivity);

// ===== DATABASE =====
const MONGO_URI = process.env.MONGO_URI || process.env.MONGODB_URI;
if (!MONGO_URI) {
  console.error("❌ Missing MONGO_URI in .env");
  process.exit(1);
}

mongoose
  .connect(MONGO_URI)
  .then(() => {
    console.log("✅ MongoDB connected");

    // ===== ROUTES =====
    app.use("/api/auth", require("./routes/auth"));
    app.use("/api/users", require("./routes/user"));

    // Health check endpoint for Render
    app.get("/health", (_req, res) => {
      res.status(200).json({
        status: "ok",
        message: "Server is running",
        timestamp: new Date().toISOString(),
      });
    });

    app.get("/", (_req, res) => res.send("User Management API"));

    const PORT = process.env.PORT || 4000;
    app.listen(PORT, () => console.log(`🚀 Server running on port ${PORT}`));
  })
  .catch((err) => {
    console.error("MongoDB connection error:", err);
    process.exit(1);
  });
