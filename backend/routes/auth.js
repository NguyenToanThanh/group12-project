const router = require("express").Router();

const {
  signup,
  login,
  refresh,
  logout,
} = require("../controllers/userController");

router.post("/signup", signup);
router.post("/login", login);
router.post("/refresh", refresh);
router.post("/logout", logout);

module.exports = router;
