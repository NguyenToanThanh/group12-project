require("dotenv").config();

const express = require("express");
const cors = require("cors");
const morgan = require("morgan");
const helmet = require("helmet");
const mongoose = require("mongoose");

const authRoutes = require("./routes/auth");
const userRoutes = require("./routes/user");

const app = express();

/* ===== Security & Parsers ===== */
app.use(helmet());
app.use(express.json({ limit: "5mb" }));
app.use(express.urlencoded({ extended: true }));
app.use(morgan("dev"));

/* ===== CORS ===== */
const allowedOrigins = [
  process.env.CLIENT_URL || "http://localhost:3000",
  "http://localhost:3000",
  "http://localhost:3001",
];

app.use(
  cors({
    origin: function (origin, callback) {
      if (!origin) return callback(null, true);
      if (
        allowedOrigins.indexOf(origin) !== -1 ||
        process.env.NODE_ENV !== "production"
      ) {
        callback(null, true);
      } else {
        callback(new Error("Not allowed by CORS"));
      }
    },
    credentials: true,
    methods: ["GET", "POST", "PUT", "PATCH", "DELETE", "OPTIONS"],
    allowedHeaders: ["Content-Type", "Authorization"],
  })
);

/* ===== Routes ===== */
app.get("/", (req, res) =>
  res.json({
    message: "Group 12 Backend API",
    version: "1.0.0",
    status: "running",
    endpoints: {
      health: "/health",
      auth: "/auth",
      users: "/users",
    },
  })
);

app.get("/health", (req, res) =>
  res.json({
    ok: true,
    time: new Date().toISOString(),
    uptime: process.uptime(),
    environment: process.env.NODE_ENV || "development",
  })
);

app.use("/auth", authRoutes);
app.use("/users", userRoutes);

// 404 Handler for all other routes
app.use((req, res) => {
  res.status(404).json({
    error: "Route not found",
    path: req.originalUrl,
    method: req.method,
  });
});

/* ===== Start & DB ===== */
const PORT = process.env.PORT || 4000;
const MONGODB_URI = process.env.MONGODB_URI;

async function start() {
  try {
    if (!MONGODB_URI) {
      throw new Error("MONGODB_URI is not defined in environment variables");
    }
    await mongoose.connect(MONGODB_URI, { autoIndex: true });
    console.log(" MongoDB connected successfully");
    console.log(` Database: ${mongoose.connection.name}`);
    app.listen(PORT, () => {
      console.log(` Server running on port ${PORT}`);
      console.log(` Environment: ${process.env.NODE_ENV || "development"}`);
      console.log(` Health check: http://localhost:${PORT}/health`);
      console.log(` API Base: http://localhost:${PORT}`);
    });
  } catch (err) {
    console.error(" Startup error:", err.message);
    process.exit(1);
  }
}

process.on("SIGTERM", async () => {
  console.log("SIGTERM received, closing server gracefully...");
  await mongoose.connection.close();
  process.exit(0);
});

process.on("SIGINT", async () => {
  console.log("\nSIGINT received, closing server gracefully...");
  await mongoose.connection.close();
  process.exit(0);
});

start();
