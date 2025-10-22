import express from "express";
import { login } from "../controllers/authController.js";
import { loginLimiter } from "../middleware/rateLimit.js";
import { logActivity } from "../middleware/logActivity.js";

const router = express.Router();

router.post(
  "/login",
  loginLimiter,
  logActivity(() => "Auth login attempt"),
  login
);

export default router;
