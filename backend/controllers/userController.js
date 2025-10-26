const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");
const crypto = require("crypto");
const sharp = require("sharp");
const fs = require("fs");
const User = require("../Models/User");
const RefreshToken = require("../Models/refreshToken.model");
const Log = require("../Models/Log");
const cloudinary = require("../utils/cloudinary");

// ===== AUTH =====
exports.signup = async (req, res) => {
  try {
    const { name, email, password, role } = req.body || {};
    if (!name || !email || !password)
      return res.status(400).json({ message: "Missing fields" });

    const existed = await User.findOne({ email: email.toLowerCase().trim() });
    if (existed)
      return res.status(409).json({ message: "Email already exists" });

    const hash = await bcrypt.hash(password, 10);
    const user = await User.create({
      name: name.trim(),
      email: email.toLowerCase().trim(),
      password: hash,
      role: role?.toLowerCase() || "user",
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

    // Generate Access Token (short-lived)
    const accessToken = jwt.sign(
      { id: user._id, role: user.role },
      process.env.JWT_SECRET,
      { expiresIn: "15m" } // 15 minutes
    );

    // Generate Refresh Token (long-lived)
    const refreshToken = jwt.sign(
      { id: user._id },
      process.env.JWT_REFRESH_SECRET || process.env.JWT_SECRET,
      { expiresIn: "7d" } // 7 days
    );

    // Save Refresh Token to database
    await RefreshToken.create({
      userId: user._id,
      token: refreshToken,
      expiresAt: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000), // 7 days
    });

    res.json({
      accessToken,
      refreshToken,
      user: {
        id: user._id,
        name: user.name,
        email: user.email,
        role: user.role,
      },
    });
  } catch (err) {
    console.error("login error:", err);
    res.status(500).json({ message: "Server error", error: err.message });
  }
};

// ===== REFRESH TOKEN =====
exports.refreshToken = async (req, res) => {
  try {
    const { refreshToken } = req.body;
    if (!refreshToken) {
      return res.status(400).json({ message: "Refresh token required" });
    }

    // Verify refresh token
    let decoded;
    try {
      decoded = jwt.verify(
        refreshToken,
        process.env.JWT_REFRESH_SECRET || process.env.JWT_SECRET
      );
    } catch (err) {
      return res
        .status(401)
        .json({ message: "Invalid or expired refresh token" });
    }

    // Check if refresh token exists in database
    const storedToken = await RefreshToken.findOne({
      token: refreshToken,
      userId: decoded.id,
    });

    if (!storedToken) {
      return res.status(401).json({ message: "Refresh token not found" });
    }

    // Check if refresh token is expired
    if (storedToken.expiresAt < new Date()) {
      await RefreshToken.deleteOne({ _id: storedToken._id });
      return res.status(401).json({ message: "Refresh token expired" });
    }

    // Get user info
    const user = await User.findById(decoded.id);
    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }

    // Generate new access token
    const newAccessToken = jwt.sign(
      { id: user._id, role: user.role },
      process.env.JWT_SECRET,
      { expiresIn: "15m" }
    );

    res.json({
      accessToken: newAccessToken,
      user: {
        id: user._id,
        name: user.name,
        email: user.email,
        role: user.role,
      },
    });
  } catch (err) {
    console.error("refreshToken error:", err);
    res.status(500).json({ message: "Server error", error: err.message });
  }
};

exports.logout = async (req, res) => {
  try {
    const { refreshToken } = req.body;

    // Delete refresh token from database
    if (refreshToken) {
      await RefreshToken.deleteOne({ token: refreshToken });
    }

    res.json({ message: "Logged out successfully" });
  } catch (err) {
    console.error("logout error:", err);
    res.status(500).json({ message: "Server error" });
  }
};

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
    const { name, avatarUrl, password, email, currentPassword } =
      req.body || {};
    const payload = {};

    if (typeof name === "string") payload.name = name.trim();
    if (typeof avatarUrl === "string") payload.avatarUrl = avatarUrl.trim();

    if ((password || email) && !currentPassword) {
      return res.status(400).json({ message: "currentPassword is required" });
    }

    if (currentPassword) {
      const me = await User.findById(req.user.id);
      if (!me) return res.status(404).json({ message: "User not found" });
      const ok = await bcrypt.compare(currentPassword, me.password);
      if (!ok)
        return res.status(401).json({ message: "Current password incorrect" });
    }

    if (typeof password === "string" && password) {
      payload.password = await bcrypt.hash(password, 10);
    }

    if (typeof email === "string" && email.trim()) {
      const newEmail = email.trim().toLowerCase();
      const exists = await User.exists({
        email: newEmail,
        _id: { $ne: req.user.id },
      });
      if (exists)
        return res.status(409).json({ message: "Email already in use" });
      payload.email = newEmail;
    }

    const u = await User.findByIdAndUpdate(req.user.id, payload, {
      new: true,
    }).select("-password");
    if (!u) return res.status(404).json({ message: "User not found" });
    res.json(u);
  } catch (err) {
    if (err?.code === 11000 && err?.keyPattern?.email) {
      return res.status(409).json({ message: "Email already in use" });
    }
    console.error("updateProfile error:", err);
    res.status(500).json({ message: "Server error" });
  }
};

// ===== UPLOAD AVATAR (với Sharp + Cloudinary) =====
exports.uploadAvatar = async (req, res) => {
  try {
    if (!req.file) {
      return res.status(400).json({ message: "Chưa chọn ảnh" });
    }

    const userId = req.user.id;
    const user = await User.findById(userId);
    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }

    // Xóa avatar cũ trên Cloudinary (nếu có)
    if (user.avatarPublicId) {
      try {
        await cloudinary.uploader.destroy(user.avatarPublicId);
      } catch (err) {
        console.warn("Could not delete old avatar:", err.message);
      }
    }

    // Resize ảnh với Sharp (max width 500px, giữ tỷ lệ)
    const resizedBuffer = await sharp(req.file.path)
      .resize({ width: 500, height: 500, fit: "cover" })
      .jpeg({ quality: 90 })
      .toBuffer();

    // Upload lên Cloudinary
    const uploadResult = await new Promise((resolve, reject) => {
      const uploadStream = cloudinary.uploader.upload_stream(
        {
          folder: "avatars",
          public_id: `user_${userId}_${Date.now()}`,
          resource_type: "image",
        },
        (error, result) => {
          if (error) reject(error);
          else resolve(result);
        }
      );
      uploadStream.end(resizedBuffer);
    });

    // Xóa file local sau khi upload
    fs.unlinkSync(req.file.path);

    // Cập nhật thông tin avatar trong database
    user.avatarUrl = uploadResult.secure_url;
    user.avatarPublicId = uploadResult.public_id;
    user.avatarFormat = uploadResult.format;
    user.avatarBytes = uploadResult.bytes;
    user.avatarWidth = uploadResult.width;
    user.avatarHeight = uploadResult.height;
    await user.save();

    res.status(200).json({
      message: "Tải ảnh thành công",
      avatar: {
        url: user.avatarUrl,
        publicId: user.avatarPublicId,
        width: user.avatarWidth,
        height: user.avatarHeight,
      },
    });
  } catch (err) {
    console.error("Upload error:", err);

    // Xóa file local nếu có lỗi
    if (req.file && fs.existsSync(req.file.path)) {
      fs.unlinkSync(req.file.path);
    }

    res
      .status(500)
      .json({ message: "Lỗi máy chủ khi tải ảnh", error: err.message });
  }
};

exports.deleteAvatar = async (req, res) => {
  try {
    const me = await User.findById(req.user.id);
    if (!me) return res.status(404).json({ message: "User not found" });

    if (me.avatarPublicId) {
      await cloudinary.uploader.destroy(me.avatarPublicId);
    }
    me.avatarUrl = undefined;
    me.avatarPublicId = undefined;
    me.avatarFormat = undefined;
    me.avatarBytes = undefined;
    me.avatarWidth = undefined;
    me.avatarHeight = undefined;
    await me.save();

    res.json({ message: "Đã xoá avatar", userId: me._id });
  } catch (err) {
    console.error("deleteAvatar error:", err);
    res.status(500).json({ message: "Lỗi máy chủ khi xoá ảnh" });
  }
};

// ===== ADMIN / RBAC =====
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

exports.updateUserRole = async (req, res) => {
  try {
    const { id } = req.params;
    let { role } = req.body || {};

    if (!role) return res.status(400).json({ message: "Thiếu trường 'role'" });

    role = role.toString().trim().toLowerCase();
    const valid = ["user", "admin", "moderator"];
    if (!valid.includes(role))
      return res.status(400).json({ message: "Giá trị 'role' không hợp lệ" });

    const u = await User.findByIdAndUpdate(
      id,
      { role },
      { new: true, runValidators: true }
    ).select("-password");

    if (!u)
      return res.status(404).json({ message: "Không tìm thấy người dùng" });

    res.json({ message: "Cập nhật quyền thành công", user: u });
  } catch (err) {
    console.error("updateUserRole error:", err);
    res.status(500).json({ message: "Lỗi máy chủ, vui lòng thử lại sau" });
  }
};

// ===== FORGOT / RESET PASSWORD =====
exports.forgotPassword = async (req, res) => {
  try {
    const { email } = req.body || {};
    const u = await User.findOne({ email: email?.toLowerCase().trim() });
    if (!u)
      return res.json({
        message: "Nếu email tồn tại, liên kết đặt lại mật khẩu đã được gửi",
      });

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
    if (!u)
      return res.status(400).json({ message: "Token invalid or expired" });

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

// ===== CREATE USER (SV3) =====
exports.createUser = async (req, res) => {
  try {
    const { name, email, password, role } = req.body;
    if (!name || !email)
      return res.status(400).json({ message: "Thiếu thông tin" });

    const existed = await User.findOne({ email: email.toLowerCase().trim() });
    if (existed) return res.status(409).json({ message: "Email đã tồn tại" });

    const hash = await bcrypt.hash(password || "123456", 10);
    const user = await User.create({
      name: name.trim(),
      email: email.toLowerCase().trim(),
      password: hash,
      role: role?.toLowerCase() || "user",
    });

    res.status(201).json({
      message: "Tạo user thành công",
      user: {
        id: user._id,
        name: user.name,
        email: user.email,
        role: user.role,
      },
    });
  } catch (err) {
    console.error("createUser error:", err);
    res.status(500).json({ message: "Server error" });
  }
};

// ===== ACTIVITY LOGS (Admin only) =====
exports.getLogs = async (req, res) => {
  try {
    const { page = 1, limit = 50, userId, action } = req.query;

    const filter = {};
    if (userId) filter.userId = userId;
    if (action) filter.action = action;

    const logs = await Log.find(filter)
      .sort({ timestamp: -1 })
      .limit(parseInt(limit))
      .skip((parseInt(page) - 1) * parseInt(limit))
      .populate("userId", "name email role");

    const total = await Log.countDocuments(filter);

    res.json({
      logs,
      pagination: {
        total,
        page: parseInt(page),
        limit: parseInt(limit),
        totalPages: Math.ceil(total / parseInt(limit)),
      },
    });
  } catch (err) {
    console.error("getLogs error:", err);
    res.status(500).json({ message: "Server error" });
  }
};

exports.getMyLogs = async (req, res) => {
  try {
    const { page = 1, limit = 20 } = req.query;

    const logs = await Log.find({ userId: req.user.id })
      .sort({ timestamp: -1 })
      .limit(parseInt(limit))
      .skip((parseInt(page) - 1) * parseInt(limit));

    const total = await Log.countDocuments({ userId: req.user.id });

    res.json({
      logs,
      pagination: {
        total,
        page: parseInt(page),
        limit: parseInt(limit),
        totalPages: Math.ceil(total / parseInt(limit)),
      },
    });
  } catch (err) {
    console.error("getMyLogs error:", err);
    res.status(500).json({ message: "Server error" });
  }
};
