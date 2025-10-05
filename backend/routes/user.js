const express = require("express");
const router = express.Router();
const { auth, adminOnly } = require("../middlewares/auth");
const upload = require("../middlewares/upload");
const {
  getProfile,
  updateProfile,
  uploadAvatar,
  deleteAvatar,
  getUsers,
  deleteUser,
  updateUserRole,
  createUser,
} = require("../controllers/userController");

// ======================
// Profile cá nhân
// ======================
router.get("/profile", auth, getProfile);
router.put("/profile", auth, updateProfile);

// ======================
// Upload / xóa avatar
// ======================
router.post("/upload-avatar", auth, upload.single("file"), uploadAvatar);
router.delete("/avatar", auth, deleteAvatar);

// ======================
// Quản lý user (Admin)
// ======================

// Xem tất cả user — chỉ admin mới được
router.get("/", auth, adminOnly, getUsers);

// Xóa user theo ID — chỉ admin
router.delete("/:id", auth, adminOnly, deleteUser);

// Cập nhật role user — chỉ admin
router.put("/:id/role", auth, adminOnly, updateUserRole);

// Thêm user mới (ví dụ thêm dữ liệu mẫu)
router.post("/", auth, adminOnly, createUser);

// ======================
// Route kiểm tra nhanh (tuỳ chọn cho test)
// ======================
router.get("/check", (_req, res) => {
  res.send("✅ User routes hoạt động bình thường");
});

module.exports = router;
