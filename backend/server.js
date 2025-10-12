const express = require('express');
const mongoose = require('mongoose');
const dotenv = require('dotenv');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const User = require('./models/User');

dotenv.config();
console.log("📦 MONGO_URI =", process.env.MONGO_URI);
console.log("📦 JWT_SECRET =", process.env.JWT_SECRET);

const app = express();
app.use(express.json());

// ===== KẾT NỐI MONGODB =====
mongoose.connect(process.env.MONGO_URI)
  .then(() => console.log('✅ Connected to MongoDB'))
  .catch(err => console.error(err));

// ===== SIGN UP =====
app.post('/api/auth/signup', async (req, res) => {
  try {
    const { name, email, password } = req.body;
    const exist = await User.findOne({ email });
    if (exist) return res.status(400).json({ message: 'Email already exists' });

    const user = new User({ name, email, password });
    await user.save();
    res.status(201).json({ message: 'User registered successfully!' });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// ===== LOGIN =====
app.post('/api/auth/login', async (req, res) => {
  try {
    const { email, password } = req.body;
    const user = await User.findOne({ email });
    if (!user) return res.status(404).json({ message: 'User not found' });

    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) return res.status(400).json({ message: 'Invalid password' });

    const token = jwt.sign(
      { id: user._id, role: user.role },
      process.env.JWT_SECRET,
      { expiresIn: '1h' }
    );

    res.json({ message: 'Login success', token });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// ===== LOGOUT =====
app.post('/api/auth/logout', (req, res) => {
  res.json({ message: 'Logout successful (token deleted client-side)' });
});

// ===== PROFILE ROUTES =====
const profileRoutes = require("./routes/profileRoutes");
app.use("/api/profile", profileRoutes);

// ===== CHẠY SERVER =====
const PORT = process.env.PORT || 5000;
const userRoutes = require("./routes/userRoutes");
app.use("/api/users", userRoutes);
app.listen(PORT, () => console.log(`🚀 Server running on port ${PORT}`));
const adminRoutes = require("./routes/adminRoutes");
app.use("/api", adminRoutes);
