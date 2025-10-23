const router = require("express").Router();

const { authLimiter } = require("../middlewares/rateLimit");
const {
  signup,
  login,
  refresh,
  logout,
} = require("../controllers/userController");
const {
  forgotPassword,
  resetPassword,
} = require("../controllers/passwordResetController");

/* ========== HOẠT ĐỘNG 1: AUTHENTICATION ========== */

// Authentication routes with rate limiting
router.post("/signup", authLimiter, signup);
router.post("/login", authLimiter, login);
router.post("/refresh", refresh);
router.post("/logout", logout);

/* ========== HOẠT ĐỘNG 4: PASSWORD RESET ========== */

// POST /auth/forgot-password - Request password reset email
router.post("/forgot-password", authLimiter, forgotPassword);

// POST /auth/reset-password/:token - Reset password with token
router.post("/reset-password/:token", authLimiter, resetPassword);

module.exports = router;
