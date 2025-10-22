// controllers/userController.js
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");
const crypto = require("crypto");
const sharp = require("sharp");

const User = require("../Models/User");
const cloud = require("../utils/cloudinary");
const transporter = require("../utils/mailer");
const { signAccess, signRefresh } = require("../utils/jwt");

/* ========== AUTH ========== */

exports.signup = async (req, res) => {
  const { name, email, password } = req.body;
  const existed = await User.findOne({ email });
  if (existed) return res.status(400).json({ message: "Email đã tồn tại" });

  const u = await User.create({ name, email, password });
  res.status(201).json({ id: u._id, email: u.email });
};

// POST /auth/login
exports.login = async (req, res) => {
  const { email, password } = req.body;
  const u = await User.findOne({ email }).select("+password");
  if (!u) return res.status(401).json({ message: "Email hoặc mật khẩu sai" });

  const ok = await bcrypt.compare(password, u.password);
  if (!ok) return res.status(401).json({ message: "Email hoặc mật khẩu sai" });

  const accessToken = signAccess({ id: u._id, role: u.role });
  const refreshToken = signRefresh({ id: u._id });

  u.refreshToken = refreshToken;
  await u.save();

  res.json({
    user: {
      id: u._id,
      email: u.email,
      role: u.role,
      name: u.name,
      avatarUrl: u.avatarUrl,
    },
    accessToken,
    refreshToken,
  });
};

// POST /auth/refresh
exports.refresh = async (req, res) => {
  const { refreshToken } = req.body;
  if (!refreshToken)
    return res.status(400).json({ message: "Missing refreshToken" });

  let payload;
  try {
    payload = jwt.verify(refreshToken, process.env.JWT_REFRESH_SECRET);
  } catch {
    return res
      .status(401)
      .json({ message: "Refresh token không hợp lệ hoặc hết hạn" });
  }

  const u = await User.findById(payload.id);
  if (!u || u.refreshToken !== refreshToken)
    return res.status(401).json({ message: "Refresh token đã bị thu hồi" });

  const accessToken = signAccess({ id: u._id, role: u.role });
  return res.json({ accessToken });
};

// POST /auth/logout
exports.logout = async (req, res) => {
  const { refreshToken } = req.body;
  if (refreshToken) {
    const u = await User.findOne({ refreshToken });
    if (u) {
      u.refreshToken = undefined; // revoke
      await u.save();
    }
  }
  res.json({ message: "Đã đăng xuất" });
};

/* ========== FORGOT / RESET PASSWORD ========== */

// POST /auth/forgot-password
exports.forgotPassword = async (req, res) => {
  const { email } = req.body;
  const u = await User.findOne({ email });
  if (!u)
    return res.json({ message: "Nếu email tồn tại, chúng tôi sẽ gửi thư" });

  const token = crypto.randomBytes(32).toString("hex");
  u.resetToken = token;
  u.resetTokenExp = new Date(Date.now() + 15 * 60 * 1000); // 15 phút
  await u.save();

  const link = `${process.env.CLIENT_URL}/reset-password/${token}`;
  await transporter.sendMail({
    from: `"Support" <${process.env.SMTP_USER}>`,
    to: email,
    subject: "Đặt lại mật khẩu",
    html: `<p>Nhấn liên kết trong 15 phút: <a href="${link}">${link}</a></p>`,
  });

  res.json({ message: "Đã gửi email nếu tồn tại" });
};

// POST /auth/reset-password/:token
exports.resetPassword = async (req, res) => {
  const { token } = req.params;
  const { password } = req.body;

  const u = await User.findOne({
    resetToken: token,
    resetTokenExp: { $gt: new Date() },
  }).select("+password");

  if (!u)
    return res.status(400).json({ message: "Token không hợp lệ/hết hạn" });

  u.password = password;
  u.resetToken = undefined;
  u.resetTokenExp = undefined;
  await u.save();

  res.json({ message: "Đổi mật khẩu thành công" });
};

/* ========== PROFILE ========== */

// GET /users/profile
exports.getProfile = async (req, res) => {
  const u = await User.findById(req.user.id).select("-password");
  res.json(u);
};

// PUT /users/profile
exports.updateProfile = async (req, res) => {
  const allowed = ["name"];
  const patch = {};
  for (const k of allowed) if (k in req.body) patch[k] = req.body[k];

  const u = await User.findByIdAndUpdate(req.user.id, patch, {
    new: true,
  }).select("-password");
  res.json(u);
};

/* ========== AVATAR ========== */

// POST /users/upload-avatar
exports.uploadAvatar = async (req, res) => {
  if (!req.file) return res.status(400).json({ message: "No file" });

  const buf = await sharp(req.file.buffer).resize(256, 256).png().toBuffer();
  const b64 = `data:image/png;base64,${buf.toString("base64")}`;

  const up = await cloud.uploader.upload(b64, { folder: "avatars" });

  const u = await User.findById(req.user.id);
  // Xoá avatar cũ nếu có
  if (u.avatarPublicId) {
    try {
      await cloud.uploader.destroy(u.avatarPublicId);
    } catch {}
  }
  u.avatarUrl = up.secure_url;
  u.avatarPublicId = up.public_id;
  u.avatarFormat = up.format;
  u.avatarBytes = up.bytes;
  u.avatarWidth = up.width;
  u.avatarHeight = up.height;
  await u.save();

  res.json({ avatarUrl: u.avatarUrl });
};

// DELETE /users/avatar
exports.deleteAvatar = async (req, res) => {
  const u = await User.findById(req.user.id);
  if (u.avatarPublicId) {
    try {
      await cloud.uploader.destroy(u.avatarPublicId);
    } catch {}
  }
  u.avatarUrl = u.avatarPublicId = u.avatarFormat = undefined;
  u.avatarBytes = u.avatarWidth = u.avatarHeight = undefined;
  await u.save();
  res.json({ message: "Đã xoá avatar" });
};

/* ========== ADMIN ========== */

// GET /users/users
exports.getUsers = async (req, res) => {
  const users = await User.find().select("-password");
  res.json(users);
};

// PUT /users/users/:id/role
exports.updateUserRole = async (req, res) => {
  const u = await User.findByIdAndUpdate(
    req.params.id,
    { role: req.body.role },
    { new: true }
  ).select("-password");
  res.json(u);
};

// DELETE /users/users/:id
exports.deleteUser = async (req, res) => {
  await User.findByIdAndDelete(req.params.id);
  res.json({ message: "Đã xoá user" });
};

/* ========== LOGS (DEBUG) ========== */

const Log = require("../Models/Log");

// GET /users/logs - Xem activity logs
exports.getLogs = async (req, res) => {
  try {
    const logs = await Log.find()
      .populate("user", "email name role")
      .sort({ createdAt: -1 })
      .limit(50); // Chỉ lấy 50 logs gần nhất
    res.json(logs);
  } catch (err) {
    console.error("getLogs error:", err);
    res.status(500).json({ message: "Lỗi server" });
  }
};
