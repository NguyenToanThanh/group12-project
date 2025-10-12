const express = require('express');
const mongoose = require('mongoose');
const dotenv = require('dotenv');

dotenv.config();

const app = express();
app.use(express.json());

// ===== KẾT NỐI MONGODB =====
mongoose.connect(process.env.MONGO_URI)
  .then(() => console.log('✅ Connected to MongoDB'))
  .catch(err => console.error(err));

// ===== ROUTES =====
const profileRoutes = require("./routes/profileRoutes");
const userRoutes = require("./routes/userRoutes");
const adminRoutes = require("./routes/adminRoutes");
const authRoutes = require("./routes/authRoutes");
const passwordRoutes = require("./routes/passwordRoutes");

app.use("/api/profile", profileRoutes);
app.use("/api/users", userRoutes);
app.use("/api", adminRoutes);
app.use("/api/auth", authRoutes);
app.use("/api/auth", passwordRoutes);

// ===== CHẠY SERVER SAU CÙNG =====
const PORT = process.env.PORT || 5000;
app.listen(PORT, () => console.log(`🚀 Server running on port ${PORT}`));
