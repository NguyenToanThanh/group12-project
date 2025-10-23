const router = require("express").Router();

const auth = require("../middlewares/auth");
const checkRole = require("../middlewares/checkRole");
const { upload, resizeImage } = require("../middlewares/upload");
const { uploadLimiter } = require("../middlewares/rateLimit");
const {
  getProfile,
  getAllUsers,
  getUserById,
  deleteUser,
  updateUserRole,
} = require("../controllers/userController");
const {
  uploadAvatar,
  deleteAvatar,
  getMe,
} = require("../controllers/avatarController");

/* ========== HOẠT ĐỘNG 1: PROFILE ========== */

// GET /users/profile - User xem profile của chính mình
router.get("/profile", auth, getProfile);

// GET /users/me - Get current user with avatar
router.get("/me", auth, getMe);

/* ========== HOẠT ĐỘNG 2: RBAC - USER MANAGEMENT ========== */

// GET /users - Admin/Moderator xem tất cả users
// Query params: ?page=1&limit=10&search=john&role=admin
router.get("/", auth, checkRole("admin", "moderator"), getAllUsers);

// GET /users/:id - Admin/Moderator xem chi tiết 1 user
router.get("/:id", auth, checkRole("admin", "moderator"), getUserById);

// DELETE /users/:id - Chỉ Admin mới xóa được user
router.delete("/:id", auth, checkRole("admin"), deleteUser);

// PATCH /users/:id/role - Chỉ Admin mới thay đổi role
router.patch("/:id/role", auth, checkRole("admin"), updateUserRole);

/* ========== HOẠT ĐỘNG 3: UPLOAD AVATAR ========== */

// POST /users/avatar - User upload avatar của chính mình
router.post(
  "/avatar",
  auth,
  uploadLimiter,
  upload.single("avatar"),
  resizeImage,
  uploadAvatar
);

// DELETE /users/avatar - User xóa avatar của chính mình
router.delete("/avatar", auth, deleteAvatar);

module.exports = router;
