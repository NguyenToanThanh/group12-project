require("dotenv").config();

const express = require("express");
const cors = require("cors");
const morgan = require("morgan");
const helmet = require("helmet");
const mongoose = require("mongoose");

const authRoutes = require("./routes/auth");
const userRoutes = require("./routes/user");
const adminRoutes = require("./routes/admin");
const { apiLimiter } = require("./middlewares/rateLimit");

const app = express();

/* ===== Security & Middlewares ===== */
app.use(helmet()); // Security headers
app.use(express.json({ limit: "5mb" }));
app.use(express.urlencoded({ extended: true }));
app.use(morgan("dev"));

/* ===== CORS ===== */
app.use(
  cors({
    origin: [process.env.CLIENT_URL || "http://localhost:3000"],
    credentials: true,
    methods: ["GET", "POST", "PUT", "PATCH", "DELETE", "OPTIONS"],
    allowedHeaders: ["Content-Type", "Authorization"],
  })
);

/* ===== Global API Rate Limiting ===== */
app.use("/api", apiLimiter);

/* ===== Routes ===== */
app.get("/health", (req, res) =>
  res.json({
    ok: true,
    time: new Date().toISOString(),
    activity: "Activity 5 - Complete Backend (Activities 1-5)",
    features: [
      "✓ Activity 1: JWT Authentication (access + refresh tokens)",
      "✓ Activity 2: Advanced RBAC (role-based access, user management)",
      "✓ Activity 3: Avatar Upload (Multer + Sharp + Cloudinary)",
      "✓ Activity 4: Password Reset (Email with Nodemailer)",
      "✓ Activity 5: Activity Logging + Account Lockout + Advanced Rate Limiting",
    ],
    endpoints: {
      auth: [
        "POST /auth/signup",
        "POST /auth/login",
        "POST /auth/refresh",
        "POST /auth/logout",
        "POST /auth/forgot-password",
        "POST /auth/reset-password/:token",
        "GET /auth/verify-reset-token/:token",
      ],
      users: [
        "GET /users/me",
        "POST /users/avatar",
        "DELETE /users/avatar",
        "GET /users/me/activities",
        "GET /users/me/activities/summary",
      ],
      admin: [
        "GET /admin/activities",
        "GET /admin/activities/stats",
        "GET /admin/activities/users/:userId",
        "DELETE /admin/activities/cleanup",
        "GET /admin/users",
        "GET /admin/users/stats/overview",
        "GET /admin/users/:id",
        "PUT /admin/users/:id/role",
        "DELETE /admin/users/:id",
      ],
    },
  })
);

app.use("/auth", authRoutes);
app.use("/users", userRoutes);
app.use("/admin", adminRoutes);

/* ===== Start & DB ===== */
const PORT = process.env.PORT || 4000;
const MONGODB_URI = process.env.MONGODB_URI;

async function start() {
  try {
    await mongoose.connect(MONGODB_URI, { autoIndex: true });
    console.log("MongoDB connected");
    console.log("🚀 Activity 5 - Complete Backend (Activities 1-5)");
    console.log("Features:");
    console.log("  ✓ JWT Authentication (access + refresh)");
    console.log("  ✓ Advanced RBAC (checkRole, user management)");
    console.log("  ✓ Avatar Upload (Multer + Sharp + Cloudinary)");
    console.log("  ✓ Password Reset (Email with Nodemailer)");
    console.log("  ✓ Activity Logging (auto-track)");
    console.log("  ✓ Account Lockout (5 attempts = 15min)");
    console.log("  ✓ Rate Limiting (login, signup, password, API)");
    const server = app.listen(PORT, () => {
      console.log(`API ready on http://localhost:${PORT}`);
      console.log(`Server is running... Press Ctrl+C to stop`);
    });

    server.on("error", (err) => {
      console.error("Server error:", err);
      process.exit(1);
    });
  } catch (err) {
    console.error("DB connection error:", err.message);
    process.exit(1);
  }
}
start();

// Keep process alive
process.on("SIGINT", () => {
  console.log("\nShutting down gracefully...");
  process.exit(0);
});
