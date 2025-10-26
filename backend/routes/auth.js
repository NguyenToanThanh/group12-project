const express = require("express");
const router = express.Router();
const {
  signup,
  login,
  logout,
  refreshToken,
  forgotPassword,
  resetPassword,
} = require("../controllers/userController");

const { loginLimiter } = require("../middlewares/rateLimit");

// Đăng ký
router.post("/signup", signup);

// Đăng nhập (giới hạn 5 lần/phút)
router.post("/login", loginLimiter, login);

// Làm mới access token
router.post("/refresh", refreshToken);

// Đăng xuất
router.post("/logout", logout);

// Quên mật khẩu & đặt lại mật khẩu
router.post("/forgot-password", forgotPassword);
router.post("/reset-password/:token", resetPassword);

module.exports = router;
