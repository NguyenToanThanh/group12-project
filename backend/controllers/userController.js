// backend/controllers/userController.js
const User = require("../Models/User");

// Lấy danh sách người dùng (GET /users)
exports.getUsers = async (req, res) => {
  try {
    const users = await User.find().sort({ createdAt: -1 });
    res.json(users);
  } catch (error) {
    res.status(500).json({ message: "Lỗi server khi lấy danh sách người dùng" });
  }
};

// Tạo người dùng mới (POST /users)
exports.createUser = async (req, res) => {
  const { name, email } = req.body || {};
  if (!name?.trim() || !email?.trim()) {
    return res.status(400).json({ message: "Name/Email is required" });
  }

  try {
    const user = await User.create({ name, email });
    res.status(201).json(user);
  } catch (error) {
    if (error.code === 11000) {
      // Trùng email
      return res.status(409).json({ message: "Email đã tồn tại" });
    }
    res.status(500).json({ message: "Lỗi server khi tạo người dùng" });
  }
};

// Cập nhật người dùng (PUT /users/:id)
exports.updateUser = async (req, res) => {
  try {
    const { id } = req.params;
    const updatedUser = await User.findByIdAndUpdate(id, req.body, { new: true });
    if (!updatedUser) return res.status(404).json({ message: "Không tìm thấy người dùng" });
    res.json(updatedUser);
  } catch (error) {
    res.status(500).json({ message: "Lỗi server khi cập nhật người dùng" });
  }
};

// Xóa người dùng (DELETE /users/:id)
exports.deleteUser = async (req, res) => {
  try {
    const { id } = req.params;
    const deletedUser = await User.findByIdAndDelete(id);
    if (!deletedUser) return res.status(404).json({ message: "Không tìm thấy người dùng" });
    res.json({ message: "User deleted" });
  } catch (error) {
    res.status(500).json({ message: "Lỗi server khi xóa người dùng" });
  }
};
