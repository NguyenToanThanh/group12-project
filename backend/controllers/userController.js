const User = require("../Models/User");
const bcrypt = require("bcryptjs");
const { signAccess, signRefresh } = require("../utils/jwt");
const jwt = require("jsonwebtoken");
const { logActivity, getClientIP } = require("../middlewares/activityLogger");

/* ========== AUTHENTICATION ========== */

// POST /auth/signup
exports.signup = async (req, res) => {
  try {
    const { name, email, password } = req.body;

    if (!name || !email || !password) {
      return res.status(400).json({ message: "Missing required fields" });
    }

    const existed = await User.findOne({ email });
    if (existed) {
      return res.status(400).json({ message: "Email already exists" });
    }

    const user = await User.create({ name, email, password });

    // Log signup activity
    await logActivity(user._id, "signup", {
      description: `New user registered: ${email}`,
      req,
    });

    const accessToken = signAccess({ id: user._id, role: user.role });
    const refreshToken = signRefresh({ id: user._id });

    user.refreshToken = refreshToken;
    await user.save();

    res.status(201).json({
      ok: true,
      user: { _id: user._id, name: user.name, email: user.email },
      accessToken,
      refreshToken,
    });
  } catch (err) {
    console.error("signup error:", err);
    res.status(500).json({ message: "Server error" });
  }
};

// POST /auth/login
exports.login = async (req, res) => {
  try {
    const { email, password } = req.body;

    if (!email || !password) {
      return res.status(400).json({ message: "Missing email or password" });
    }

    // Find user and include password field
    const user = await User.findOne({ email }).select("+password +lockUntil");

    if (!user) {
      return res.status(400).json({ message: "Invalid credentials" });
    }

    // Check if account is locked
    if (user.isLocked) {
      const lockTimeRemaining = Math.ceil(
        (user.lockUntil - Date.now()) / 1000 / 60
      );

      // Log failed login due to lock
      await logActivity(user._id, "failed_login", {
        description: `Login attempt while account locked`,
        status: "warning",
        req,
        metadata: { reason: "account_locked", lockTimeRemaining },
      });

      return res.status(423).json({
        message: `Account is locked. Please try again in ${lockTimeRemaining} minutes.`,
        locked: true,
        retryAfter: lockTimeRemaining,
      });
    }

    // Verify password
    const isMatch = await bcrypt.compare(password, user.password);

    if (!isMatch) {
      // Increment failed login attempts
      await user.incLoginAttempts();

      // Log failed login
      await logActivity(user._id, "failed_login", {
        description: `Failed login attempt for ${email}`,
        status: "failure",
        req,
        metadata: {
          attempts: user.loginAttempts + 1,
          maxAttempts: 5,
        },
      });

      // Check if account just got locked
      if (user.loginAttempts + 1 >= 5) {
        await logActivity(user._id, "account_locked", {
          description: `Account locked after 5 failed login attempts`,
          status: "warning",
          req,
        });

        return res.status(423).json({
          message:
            "Too many failed login attempts. Account locked for 15 minutes.",
          locked: true,
          retryAfter: 15,
        });
      }

      const attemptsLeft = 5 - (user.loginAttempts + 1);
      return res.status(400).json({
        message: "Invalid credentials",
        attemptsLeft,
      });
    }

    // Successful login - reset attempts
    await user.resetLoginAttempts();

    // Update last login info
    user.lastLoginIP = getClientIP(req);
    await user.save();

    // Log successful login
    await logActivity(user._id, "login", {
      description: `User logged in successfully`,
      req,
    });

    const accessToken = signAccess({ id: user._id, role: user.role });
    const refreshToken = signRefresh({ id: user._id });

    user.refreshToken = refreshToken;
    await user.save();

    res.json({
      ok: true,
      user: {
        _id: user._id,
        name: user.name,
        email: user.email,
        role: user.role,
        lastLogin: user.lastLogin,
      },
      accessToken,
      refreshToken,
    });
  } catch (err) {
    console.error("login error:", err);
    res.status(500).json({ message: "Server error" });
  }
};

// POST /auth/refresh
exports.refresh = async (req, res) => {
  try {
    const { refreshToken } = req.body;

    if (!refreshToken) {
      return res.status(400).json({ message: "Missing refresh token" });
    }

    const payload = jwt.verify(refreshToken, process.env.JWT_REFRESH_SECRET);

    const user = await User.findById(payload.id).select("+refreshToken");

    if (!user || user.refreshToken !== refreshToken) {
      return res.status(401).json({ message: "Invalid refresh token" });
    }

    const newAccessToken = signAccess({ id: user._id, role: user.role });
    const newRefreshToken = signRefresh({ id: user._id });

    user.refreshToken = newRefreshToken;
    await user.save();

    res.json({
      ok: true,
      accessToken: newAccessToken,
      refreshToken: newRefreshToken,
    });
  } catch (err) {
    console.error("refresh error:", err);
    if (err.name === "TokenExpiredError" || err.name === "JsonWebTokenError") {
      return res.status(401).json({ message: "Invalid or expired token" });
    }
    res.status(500).json({ message: "Server error" });
  }
};

// POST /auth/logout
exports.logout = async (req, res) => {
  try {
    const { refreshToken } = req.body;

    if (!refreshToken) {
      return res.status(400).json({ message: "Missing refresh token" });
    }

    const payload = jwt.verify(refreshToken, process.env.JWT_REFRESH_SECRET);

    const user = await User.findById(payload.id);

    if (user) {
      // Log logout activity
      await logActivity(user._id, "logout", {
        description: "User logged out",
        req,
      });

      user.refreshToken = null;
      await user.save();
    }

    res.json({ ok: true, message: "Logged out successfully" });
  } catch (err) {
    console.error("logout error:", err);
    res.status(500).json({ message: "Server error" });
  }
};

// GET /users/me
exports.getMe = async (req, res) => {
  try {
    const user = await User.findById(req.user.id).select(
      "-password -refreshToken"
    );

    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }

    res.json({
      ok: true,
      user: {
        _id: user._id,
        name: user.name,
        email: user.email,
        role: user.role,
        avatar: user.avatar,
        avatarPublicId: user.avatarPublicId,
        lastLogin: user.lastLogin,
        lastLoginIP: user.lastLoginIP,
        createdAt: user.createdAt,
      },
    });
  } catch (err) {
    console.error("getMe error:", err);
    res.status(500).json({ message: "Server error" });
  }
};
