const express = require("express");
const router = express.Router();

const { auth, adminOnly, checkRole } = require("../middlewares/auth");
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
  getLogs,
  getMyLogs,
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
// Activity Logs
// ======================
// Xem logs của chính mình
router.get("/logs/me", auth, getMyLogs);

// Xem tất cả logs (Admin only)
router.get("/logs", auth, adminOnly, getLogs);

// ======================
// Quản lý user (Admin/Moderator)
// ======================

// Xem tất cả user — admin/moderator
router.get("/", auth, checkRole("admin", "moderator"), getUsers);

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
