const router = require("express").Router();
const verifyToken = require("../middlewares/auth");
const { getMe } = require("../controllers/userController");
const {
  getMyActivities,
  getMyActivitySummary,
} = require("../controllers/activityController");
const {
  uploadAvatar,
  deleteAvatar,
} = require("../controllers/avatarController");
const { upload, resizeImage } = require("../middlewares/upload");

// User routes
router.get("/me", verifyToken, getMe);

// Activity 3: Avatar upload routes
router.post(
  "/avatar",
  verifyToken,
  upload.single("avatar"),
  resizeImage,
  uploadAvatar
);
router.delete("/avatar", verifyToken, deleteAvatar);

// Activity 5: Activity routes for current user
router.get("/me/activities", verifyToken, getMyActivities);
router.get("/me/activities/summary", verifyToken, getMyActivitySummary);

module.exports = router;
