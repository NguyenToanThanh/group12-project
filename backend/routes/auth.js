const router = require("express").Router();
const {
  loginLimiter,
  signupLimiter,
  signupSpeedLimiter,
  passwordResetLimiter,
} = require("../middlewares/rateLimit");

const {
  signup,
  login,
  refresh,
  logout,
} = require("../controllers/userController");

const {
  forgotPassword,
  resetPassword,
  verifyResetToken,
} = require("../controllers/passwordResetController");

// Authentication routes with rate limiting
router.post("/signup", signupLimiter, signupSpeedLimiter, signup);
router.post("/login", loginLimiter, login);
router.post("/refresh", refresh);
router.post("/logout", logout);

// Activity 4: Password reset routes
router.post("/forgot-password", passwordResetLimiter, forgotPassword);
router.post("/reset-password/:token", resetPassword);
router.get("/verify-reset-token/:token", verifyResetToken);

module.exports = router;
