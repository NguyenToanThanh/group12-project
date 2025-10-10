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
} = require("../controllers/userController");

// Profile cá nhân
router.get("/profile", auth, getProfile);
router.put("/profile", auth, updateProfile);

router.post("/upload-avatar", auth, upload.single("file"), uploadAvatar);
router.delete("/avatar", auth, deleteAvatar);

// Admin
router.get("/users", auth, adminOnly, getUsers);
router.delete("/users/:id", auth, adminOnly, deleteUser);
router.put("/users/:id/role", auth, adminOnly, updateUserRole);

module.exports = router;
