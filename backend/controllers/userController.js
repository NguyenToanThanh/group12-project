const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");
const crypto = require("crypto");
const User = require("../Models/User");

// ===== AUTH =====
exports.signup = async (req, res) => {
  try {
    const { name, email, password, role } = req.body || {};
    if (!name || !email || !password)
      return res.status(400).json({ message: "Missing fields" });

    const existed = await User.findOne({ email: email.toLowerCase().trim() });
    if (existed) return res.status(409).json({ message: "Email already exists" });

    const hash = await bcrypt.hash(password, 10);
    const user = await User.create({
      name: name.trim(),
      email: email.toLowerCase().trim(),
      password: hash,
      role: role || "user",
    });

    res.status(201).json({ id: user._id, email: user.email });
  } catch (err) {
    console.error("signup error:", err);
    res.status(500).json({ message: "Server error", error: err.message });
  }
};

exports.login = async (req, res) => {
  try {
    const { email, password } = req.body || {};
    if (!email || !password)
      return res.status(400).json({ message: "Missing fields" });

    const user = await User.findOne({ email: email.toLowerCase().trim() });
    if (!user) return res.status(401).json({ message: "Invalid credentials" });

    const ok = await bcrypt.compare(password, user.password);
    if (!ok) return res.status(401).json({ message: "Invalid credentials" });

    const token = jwt.sign(
      { id: user._id, role: user.role },
      process.env.JWT_SECRET,
      { expiresIn: process.env.JWT_EXPIRES || "7d" }
    );

    res.json({ token });
  } catch (err) {
    console.error("login error:", err);
    res.status(500).json({ message: "Server error", error: err.message });
  }
};

exports.logout = async (_req, res) =>
  res.json({ message: "Client remove token" });

// ===== PROFILE =====
exports.getProfile = async (req, res) => {
  try {
    const u = await User.findById(req.user.id).select("-password");
    if (!u) return res.status(404).json({ message: "User not found" });
    res.json(u);
  } catch (err) {
    console.error("getProfile error:", err);
    res.status(500).json({ message: "Server error" });
  }
};

exports.updateProfile = async (req, res) => {
  try {
    const { name, avatarUrl, password, email, currentPassword } = req.body || {};
    const payload = {};

    if (typeof name === "string") payload.name = name.trim();
    if (typeof avatarUrl === "string") payload.avatarUrl = avatarUrl.trim();

    // Nếu muốn đổi password hoặc email -> yêu cầu currentPassword để xác thực
    if ((password || email) && !currentPassword) {
      return res.status(400).json({ message: "currentPassword is required" });
    }

    // Xác thực currentPassword (nếu gửi)
    if (currentPassword) {
      const me = await User.findById(req.user.id);
      if (!me) return res.status(404).json({ message: "User not found" });
      const ok = await bcrypt.compare(currentPassword, me.password);
      if (!ok) return res.status(401).json({ message: "Current password incorrect" });
    }

    // Đổi password
    if (typeof password === "string" && password) {
      payload.password = await bcrypt.hash(password, 10);
    }

    // Đổi email
    if (typeof email === "string" && email.trim()) {
      const newEmail = email.trim().toLowerCase();
      const exists = await User.exists({ email: newEmail, _id: { $ne: req.user.id } });
      if (exists) return res.status(409).json({ message: "Email already in use" });
      payload.email = newEmail;
    }

    const u = await User.findByIdAndUpdate(req.user.id, payload, { new: true })
      .select("-password");
    if (!u) return res.status(404).json({ message: "User not found" });
    res.json(u);
  } catch (err) {
    // Unique email error
    if (err?.code === 11000 && err?.keyPattern?.email) {
      return res.status(409).json({ message: "Email already in use" });
    }
    console.error("updateProfile error:", err);
    res.status(500).json({ message: "Server error" });
  }
};

// ===== ADMIN =====
exports.getUsers = async (_req, res) => {
  try {
    const users = await User.find().select("-password").sort({ createdAt: -1 });
    res.json(users);
  } catch (err) {
    console.error("getUsers error:", err);
    res.status(500).json({ message: "Server error" });
  }
};

exports.deleteUser = async (req, res) => {
  try {
    const { id } = req.params;
    const rs = await User.findByIdAndDelete(id);
    if (!rs) return res.status(404).json({ message: "User not found" });
    res.json({ message: "User deleted" });
  } catch (err) {
    console.error("deleteUser error:", err);
    res.status(500).json({ message: "Server error" });
  }
};

// ===== FORGOT / RESET PASSWORD =====
exports.forgotPassword = async (req, res) => {
  try {
    const { email } = req.body || {};
    const u = await User.findOne({ email: email?.toLowerCase().trim() });
    // Để an toàn: luôn trả message giống nhau
    if (!u) return res.json({ message: "If email exists, a reset link was sent" });

    const token = crypto.randomBytes(20).toString("hex");
    u.resetToken = token;
    u.resetTokenExp = new Date(Date.now() + 1000 * 60 * 30);
    await u.save();

 
    res.json({ message: "Reset token generated", token });
  } catch (err) {
    console.error("forgotPassword error:", err);
    res.status(500).json({ message: "Server error" });
  }
};

exports.resetPassword = async (req, res) => {
  try {
    const { token } = req.params;
    const { password } = req.body || {};
    if (!password) return res.status(400).json({ message: "Missing password" });

    const u = await User.findOne({
      resetToken: token,
      resetTokenExp: { $gt: new Date() },
    });
    if (!u) return res.status(400).json({ message: "Token invalid or expired" });

    u.password = await bcrypt.hash(password, 10);
    u.resetToken = undefined;
    u.resetTokenExp = undefined;
    await u.save();

    res.json({ message: "Password updated" });
  } catch (err) {
    console.error("resetPassword error:", err);
    res.status(500).json({ message: "Server error" });
  }
};
