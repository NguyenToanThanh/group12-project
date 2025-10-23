import express from "express";
import { verifyToken } from "../middleware/verifyToken.js";
import { upload } from "../middleware/upload.js";
import { logActivity } from "../middleware/logActivity.js";
import { updateAvatar } from "../controllers/userController.js";

const router = express.Router();

router.post(
  "/avatar",
  verifyToken,
  upload.single("avatar"),
  logActivity(() => "Upload avatar"),
  updateAvatar
);

export default router;
