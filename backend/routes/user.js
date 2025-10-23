const router = require("express").Router();

const auth = require("../middlewares/auth");
const checkRole = require("../middlewares/checkRole");
const {
  getProfile,
  getAllUsers,
  deleteUser,
  updateUserRole,
  getUserById,
} = require("../controllers/userController");

/* ========== HOẠT ĐỘNG 1: PROTECTED ROUTES ========== */

// GET /users/profile - User xem profile của chính mình
router.get("/profile", auth, getProfile);

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

module.exports = router;
