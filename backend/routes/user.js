const router = require("express").Router();

const auth = require("../middlewares/auth");
const { getProfile } = require("../controllers/userController");
const {
  uploadAvatar,
  deleteAvatar,
  getMe,
} = require("../controllers/avatarController");
const { upload, resizeImage } = require("../middlewares/upload");

// Protected routes - require authentication
router.get("/profile", auth, getProfile);
router.get("/me", auth, getMe);

// Avatar upload routes
router.post(
  "/avatar",
  auth,
  upload.single("avatar"),
  resizeImage,
  uploadAvatar
);
router.delete("/avatar", auth, deleteAvatar);

module.exports = router;
