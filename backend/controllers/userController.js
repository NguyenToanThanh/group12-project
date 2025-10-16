const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");

const User = require("../Models/User");
const { signAccess, signRefresh } = require("../utils/jwt");

/* ========== AUTH ========== */

// POST /auth/signup
exports.signup = async (req, res) => {
  try {
    const { name, email, password } = req.body;
    if (!name || !email || !password)
      return res.status(400).json({ message: "Missing required fields" });

    const existed = await User.findOne({ email });
    if (existed)
      return res.status(400).json({ message: "Email already exists" });

    const user = await User.create({ name, email, password });
    res.status(201).json({ id: user._id, email: user.email });
  } catch (err) {
    console.error("signup error:", err);
    res.status(500).json({ message: "Server error" });
  }
};

// POST /auth/login
exports.login = async (req, res) => {
  try {
    const { email, password } = req.body;
    if (!email || !password)
      return res.status(400).json({ message: "Missing email or password" });

    const user = await User.findOne({ email }).select("+password");
    if (!user) return res.status(401).json({ message: "Invalid credentials" });

    const ok = await bcrypt.compare(password, user.password);
    if (!ok) return res.status(401).json({ message: "Invalid credentials" });

    // Generate tokens
    const accessToken = signAccess({ id: user._id, role: user.role });
    const refreshToken = signRefresh({ id: user._id });

    // Store refresh token in database
    user.refreshToken = refreshToken;
    await user.save();

    res.json({
      user: {
        id: user._id,
        email: user.email,
        role: user.role,
        name: user.name,
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
    if (!refreshToken)
      return res.status(400).json({ message: "Missing refreshToken" });

    // Verify refresh token
    let payload;
    try {
      payload = jwt.verify(refreshToken, process.env.JWT_REFRESH_SECRET);
    } catch {
      return res
        .status(401)
        .json({ message: "Invalid or expired refresh token" });
    }

    // Find user and check if refresh token matches
    const user = await User.findById(payload.id);
    if (!user || user.refreshToken !== refreshToken)
      return res.status(401).json({ message: "Refresh token revoked" });

    // Generate new access token
    const accessToken = signAccess({ id: user._id, role: user.role });

    // Optionally rotate refresh token
    const newRefreshToken = signRefresh({ id: user._id });
    user.refreshToken = newRefreshToken;
    await user.save();

    res.json({ accessToken, refreshToken: newRefreshToken });
  } catch (err) {
    console.error("refresh error:", err);
    res.status(500).json({ message: "Server error" });
  }
};

// POST /auth/logout
exports.logout = async (req, res) => {
  try {
    const { refreshToken } = req.body;
    if (refreshToken) {
      const user = await User.findOne({ refreshToken });
      if (user) {
        user.refreshToken = undefined; // revoke refresh token
        await user.save();
      }
    }
    res.json({ message: "Logged out successfully" });
  } catch (err) {
    console.error("logout error:", err);
    res.status(500).json({ message: "Server error" });
  }
};

/* ========== PROFILE ========== */

// GET /users/profile
exports.getProfile = async (req, res) => {
  try {
    const user = await User.findById(req.user.id).select("-password");
    if (!user) return res.status(404).json({ message: "User not found" });
    res.json(user);
  } catch (err) {
    console.error("getProfile error:", err);
    res.status(500).json({ message: "Server error" });
  }
};
