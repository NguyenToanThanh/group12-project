// routes/user.js
const router = require("express").Router();

const auth = require("../middlewares/auth");
const checkRole = require("../middlewares/checkRole");
const upload = require("../middlewares/upload");

const {
  getProfile,
  updateProfile,
  uploadAvatar,
  deleteAvatar,
  getUsers,
  deleteUser,
  updateUserRole,
  getLogs,
} = require("../controllers/userController");

// Profile
router.get("/profile", auth, getProfile);
router.put("/profile", auth, updateProfile);

// Avatar
router.post("/upload-avatar", auth, upload.single("file"), uploadAvatar);
router.delete("/avatar", auth, deleteAvatar);

// Admin
router.get("/users", auth, checkRole("admin"), getUsers);
router.delete("/users/:id", auth, checkRole("admin"), deleteUser);
router.put("/users/:id/role", auth, checkRole("admin"), updateUserRole);

// Logs (Debug)
router.get("/logs", auth, checkRole("admin"), getLogs);

module.exports = router;
