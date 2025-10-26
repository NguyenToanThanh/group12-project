require("dotenv").config();

const express = require("express");
const cors = require("cors");
const morgan = require("morgan");
const mongoose = require("mongoose");
const path = require("path");

const app = express();

/* ===== MIDDLEWARE ===== */
app.use(
  cors({
    origin: [process.env.CLIENT_URL || "http://localhost:3000"],
    credentials: true,
    methods: ["GET", "POST", "PUT", "PATCH", "DELETE", "OPTIONS"],
    allowedHeaders: ["Content-Type", "Authorization"],
  })
);
app.use(express.json({ limit: "5mb" }));
app.use(express.urlencoded({ extended: true }));
app.use(morgan("dev"));
app.use("/uploads", express.static(path.join(__dirname, "uploads")));

/* ===== CUSTOM MIDDLEWARE ===== */
const logActivity = require("./middlewares/logActivity");
app.use(logActivity);

/* ===== ROUTES ===== */
app.get("/health", (req, res) =>
  res.json({
    ok: true,
    status: "running",
    timestamp: new Date().toISOString(),
    mongodb:
      mongoose.connection.readyState === 1 ? "connected" : "disconnected",
    activities: [
      "✓ Activity 1: JWT Authentication (access + refresh tokens)",
      "✓ Activity 2: Advanced RBAC (3 roles: user/moderator/admin)",
      "✓ Activity 3: Avatar Upload (Multer + Sharp + Cloudinary)",
      "✓ Activity 4: Password Reset (Email with Nodemailer)",
      "✓ Activity 5: Activity Logging + Rate Limiting",
    ],
  })
);

app.get("/", (req, res) => res.send("Group 12 - User Management API"));

app.use("/api/auth", require("./routes/auth"));
app.use("/api/users", require("./routes/user"));

/* ===== START SERVER ===== */
const PORT = process.env.PORT || 4000;
const MONGO_URI = process.env.MONGO_URI || process.env.MONGODB_URI;

if (!MONGO_URI) {
  console.error("❌ Missing MONGO_URI in environment variables");
  process.exit(1);
}

async function start() {
  try {
    await mongoose.connect(MONGO_URI, {
      serverSelectionTimeoutMS: 5000,
      socketTimeoutMS: 45000,
    });
    console.log("✅ MongoDB connected");
    console.log("🚀 Group 12 - Backend Server");
    console.log("📦 Activities 1-5 Completed:");
    console.log("  ✓ JWT Authentication (access + refresh)");
    console.log("  ✓ Advanced RBAC (checkRole, 3 roles)");
    console.log("  ✓ Avatar Upload (Sharp + Cloudinary)");
    console.log("  ✓ Password Reset (Email)");
    console.log("  ✓ Activity Logging + Rate Limiting");

    const server = app.listen(PORT, () => {
      console.log(`🌐 Server running on port ${PORT}`);
      console.log(`📍 Health check: http://localhost:${PORT}/health`);
    });

    server.on("error", (err) => {
      console.error("❌ Server error:", err);
      process.exit(1);
    });
  } catch (err) {
    console.error("❌ MongoDB connection error:", err.message);
    console.error("⚠️ Check your MONGO_URI in .env file");
    process.exit(1);
  }
}

start();

// Graceful shutdown
process.on("SIGINT", () => {
  console.log("\n🛑 Shutting down gracefully...");
  mongoose.connection.close();
  process.exit(0);
});
