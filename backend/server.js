const express = require("express");
const cors = require("cors");
const morgan = require("morgan");
const mongoose = require("mongoose");
require("dotenv").config();
const path = require("path");

const app = express();

// ======= MIDDLEWARE CƠ BẢN =======
app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(morgan("dev"));
app.use("/uploads", express.static(path.join(__dirname, "uploads")));

// ======= CUSTOM MIDDLEWARE =======
const logActivity = require('./middlewares/logActivity');
app.use(logActivity); // đặt TRƯỚC routes, để ghi log mọi request

// ======= KẾT NỐI DATABASE =======
const MONGO_URI = process.env.MONGO_URI;
if (!MONGO_URI) {
  console.error("Missing MONGO_URI in .env");
  process.exit(1);
}

mongoose.set("strictQuery", false);
mongoose
  .connect(MONGO_URI)
  .then(() => {
    console.log("MongoDB connected");

    // ======= ROUTES =======
    app.use("/api/auth", require("./routes/auth"));
    app.use("/api/users", require("./routes/user"));

    // ======= TEST ROOT =======
    app.get("/", (_req, res) => res.send("User Management API"));

    const PORT = process.env.PORT || 4000;
    app.listen(PORT, () => console.log(`✅ API running on port ${PORT}`));
  })
  .catch((err) => {
    console.error("MongoDB connection error:", err);
    process.exit(1);
  });
