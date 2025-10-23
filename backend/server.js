require("dotenv").config();
const express = require("express");
const mongoose = require("mongoose");
const cors = require("cors");
const helmet = require("helmet");
const morgan = require("morgan");

const authRoutes = require("./routes/auth");
const userRoutes = require("./routes/user");

const app = express();

/* ========== MIDDLEWARE ========== */

// Security
app.use(helmet());

// CORS
app.use(
  cors({
    origin: process.env.CLIENT_URL || "http://localhost:3000",
    credentials: true,
    methods: ["GET", "POST", "PUT", "PATCH", "DELETE", "OPTIONS"],
    allowedHeaders: ["Content-Type", "Authorization"],
  })
);

// Body parser
app.use(express.json({ limit: "5mb" }));
app.use(express.urlencoded({ extended: true }));

// Logging
app.use(morgan("dev"));

/* ========== ROUTES ========== */

// Health check
app.get("/", (req, res) => {
  res.json({
    ok: true,
    message: "Activity 3: Avatar Upload + RBAC + Authentication",
    time: new Date().toISOString(),
  });
});

app.get("/health", (req, res) => {
  res.json({
    ok: true,
    time: new Date().toISOString(),
  });
});

// API routes
app.use("/auth", authRoutes);
app.use("/users", userRoutes);

// 404 handler
app.use((req, res) => {
  res.status(404).json({ message: "Route not found" });
});

// Error handler
app.use((err, req, res, next) => {
  console.error("Error:", err);
  res.status(err.status || 500).json({
    message: err.message || "Internal server error",
  });
});

/* ========== DATABASE CONNECTION ========== */

mongoose
  .connect(process.env.MONGODB_URI, { autoIndex: true })
  .then(() => console.log("✅ MongoDB connected"))
  .catch((err) => {
    console.error("❌ MongoDB connection error:", err);
    process.exit(1);
  });

/* ========== START SERVER ========== */

const PORT = process.env.PORT || 5000;

const server = app.listen(PORT, () => {
  console.log(`🚀 Server running on port ${PORT}`);
  console.log(`📝 Environment: ${process.env.NODE_ENV || "development"}`);
});

// Graceful shutdown
process.on("SIGTERM", () => {
  console.log("SIGTERM signal received: closing HTTP server");
  server.close(() => {
    console.log("HTTP server closed");
    mongoose.connection.close(false, () => {
      console.log("MongoDB connection closed");
      process.exit(0);
    });
  });
});
