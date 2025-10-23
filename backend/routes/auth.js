const router = require("express").Router();

const { authLimiter } = require("../middlewares/rateLimit");
const {
  signup,
  login,
  refresh,
  logout,
} = require("../controllers/userController");

// Authentication routes with rate limiting
router.post("/signup", authLimiter, signup);
router.post("/login", authLimiter, login);
router.post("/refresh", refresh);
router.post("/logout", logout);

module.exports = router;
