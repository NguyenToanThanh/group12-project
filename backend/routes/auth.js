const router = require("express").Router();
const { loginLimiter } = require("../middlewares/rateLimit");

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

// Authentication routes
router.post("/signup", signup);
router.post("/login", loginLimiter, login); // Apply rate limiting to login
router.post("/refresh", refresh);
router.post("/logout", logout);

// Password reset routes
router.post("/forgot-password", forgotPassword);
router.post("/reset-password/:token", resetPassword);
router.get("/verify-reset-token/:token", verifyResetToken);

module.exports = router;
