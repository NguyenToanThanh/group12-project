const router = require("express").Router();

const auth = require("../middlewares/auth");
const { getProfile } = require("../controllers/userController");

// Protected route example
router.get("/profile", auth, getProfile);

module.exports = router;
