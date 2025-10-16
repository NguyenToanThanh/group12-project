const router = require("express").Router();
const { loginLimiter } = require("../middlewares/rateLimit");

const {
  signup,
  login,
  refresh,
  logout,
} = require("../controllers/userController");

router.post("/signup", signup);
router.post("/login", loginLimiter, login); // Apply rate limiting to login
router.post("/refresh", refresh);
router.post("/logout", logout);

module.exports = router;
