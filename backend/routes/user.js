// backend/routes/user.js
const express = require("express");
const router = express.Router();
const { auth, adminOnly } = require("../middlewares/auth");
const {
  getProfile, updateProfile,
  getUsers, deleteUser
} = require("../controllers/userController");

// Profile cá nhân
router.get("/profile", auth, getProfile);
router.put("/profile", auth, updateProfile);

// Quản trị
router.get("/users", auth, adminOnly, getUsers);
router.delete("/users/:id", auth, adminOnly, deleteUser);

module.exports = router;
