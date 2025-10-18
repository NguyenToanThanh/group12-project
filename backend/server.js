require("dotenv").config();

const express = require("express");
const cors = require("cors");
const morgan = require("morgan");
const helmet = require("helmet");
const mongoose = require("mongoose");

const authRoutes = require("./routes/auth");
const userRoutes = require("./routes/user");

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

/* ===== Routes ===== */
app.get("/health", (req, res) =>
  res.json({
    ok: true,
    time: new Date().toISOString(),
    activity: "Activity 3 - Avatar Upload",
    features: [
      "JWT Auth",
      "Rate Limiting",
      "Security Headers",
      "Avatar Upload (Multer + Sharp + Cloudinary)",
    ],
  })
);

app.use("/auth", authRoutes);
app.use("/users", userRoutes);

/* ===== Start & DB ===== */
const PORT = process.env.PORT || 4000;
const MONGODB_URI = process.env.MONGODB_URI;

async function start() {
  try {
    await mongoose.connect(MONGODB_URI, { autoIndex: true });
    console.log("MongoDB connected");
    console.log("Activity 3: Avatar Upload with Multer + Sharp + Cloudinary");
    app.listen(PORT, () =>
      console.log(`API ready on http://localhost:${PORT}`)
    );
  } catch (err) {
    console.error("DB connection error:", err.message);
    process.exit(1);
  }
}
start();
