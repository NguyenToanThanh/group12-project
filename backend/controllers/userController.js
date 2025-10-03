// backend/controllers/userController.js
const User = require('../Models/User');   // chữ M viết hoa vì thư mục Models

// GET /users  → lấy từ MongoDB
exports.getUsers = async (req, res) => {
  const users = await User.find().sort({ createdAt: -1 });
  res.json(users);
};

// POST /users → lưu vào MongoDB
exports.createUser = async (req, res) => {
  const { name, email } = req.body || {};
  if (!name?.trim() || !email?.trim()) {
    return res.status(400).json({ message: 'Name/Email is required' });
  }
  try {
    const user = await User.create({ name, email });
    res.status(201).json(user);
  } catch (e) {
    if (e.code === 11000) { // duplicate email
      return res.status(409).json({ message: 'Email đã tồn tại' });
    }
    res.status(500).json({ message: 'Server error' });
  }
};
