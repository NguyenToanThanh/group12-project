<<<<<<< HEAD
// backend/controllers/userController.js
const User = require('/Models/User');

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
=======
let users = []; // mảng tạm nếu chưa dùng MongoDB

exports.getUsers = (req, res) => {
  res.json(users);
};

exports.createUser = (req, res) => {
  const { name, email } = req.body || {};
  if (!name?.trim() || !email?.trim()) {
    return res.status(400).json({ message: "Name/Email is required" });
  }
  const user = { id: Date.now().toString(), name, email };
  users.unshift(user);
  res.status(201).json(user);
};

exports.updateUser = (req, res) => {
  const { id } = req.params;
  const index = users.findIndex((u) => u.id == id);
  if (index !== -1) {
    users[index] = { ...users[index], ...req.body };
    return res.json(users[index]);
  }
  res.status(404).json({ message: "User not found" });
};

exports.deleteUser = (req, res) => {
  const { id } = req.params;
  users = users.filter((u) => u.id != id);
  res.json({ message: "User deleted" });
>>>>>>> 8b4701d470cc2192f38f68c68e1bf929b09a4edc
};
