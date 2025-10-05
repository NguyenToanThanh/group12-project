// backend/controllers/userController.js
const User = require("../Models/User"); // Chú ý "Models" viết hoa

// GET /users
exports.getUsers = async (req, res) => {
  try {
    const users = await User.find().sort({ createdAt: -1 });
    res.json(users);
  } catch (err) {
    console.error("getUsers error:", err);
    res.status(500).json({ message: "Server error" });
  }
};

// POST /users
exports.createUser = async (req, res) => {
  try {
    const { name, email } = req.body || {};
    if (!name?.trim() || !email?.trim()) {
      return res.status(400).json({ message: "name và email là bắt buộc" });
    }
    const user = await User.create({ name: name.trim(), email: email.trim() });
    res.status(201).json(user);
  } catch (err) {
    if (err?.code === 11000) {
      return res.status(409).json({ message: "Email đã tồn tại" });
    }
    console.error("createUser error:", err);
    res.status(500).json({ message: "Server error" });
  }
};

// PUT /users/:id
exports.updateUser = async (req, res) => {
  try {
    const { id } = req.params;
    const payload = {};
    if (typeof req.body?.name === "string") payload.name = req.body.name.trim();
    if (typeof req.body?.email === "string")
      payload.email = req.body.email.trim();

    const user = await User.findByIdAndUpdate(id, payload, {
      new: true,
      runValidators: true,
    });
    if (!user) return res.status(404).json({ message: "User not found" });
    res.json(user);
  } catch (err) {
    if (err?.code === 11000) {
      return res.status(409).json({ message: "Email đã tồn tại" });
    }
    console.error("updateUser error:", err);
    res.status(500).json({ message: "Server error" });
  }
};

// DELETE /users/:id
exports.deleteUser = async (req, res) => {
  try {
    const { id } = req.params;
    const rs = await User.findByIdAndDelete(id);
    if (!rs) return res.status(404).json({ message: "User not found" });
    res.json({ message: "User deleted" });
  } catch (err) {
    console.error("deleteUser error:", err);
    res.status(500).json({ message: "Server error" });
  }
};
