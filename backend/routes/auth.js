const router = require("express").Router();
const { loginLimiter } = require("../middlewares/rateLimit");
const logActivity = require("../middlewares/logActivity");

const {
  signup,
  login,
  refresh,
  logout,
  forgotPassword,
  resetPassword,
} = require("../controllers/userController");

router.post("/signup", signup);
router.post("/login", loginLimiter, logActivity("login"), login);
router.post("/refresh", refresh);
router.post("/logout", logActivity("logout"), logout);

router.post("/forgot-password", forgotPassword);
router.post("/reset-password/:token", resetPassword);

module.exports = router;
