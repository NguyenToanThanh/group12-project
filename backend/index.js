// backend/index.js - With JWT & Refresh Token
const express = require("express");
const cors = require("cors");
const path = require("path");
const multer = require("multer");
const {
  generateAccessToken,
  generateRefreshToken,
  verifyRefreshToken,
  revokeRefreshToken,
  authenticateToken
} = require("./auth");
const app = express();

/* ===== CORS: khớp CRA 3000 và cho phép cookie ===== */
const corsOptions = {
  origin: ["http://localhost:3000", "http://127.0.0.1:3000", null], // null cho phép file://
  credentials: true,
  methods: ["GET", "POST", "PUT", "PATCH", "DELETE", "OPTIONS"],
  allowedHeaders: ["Content-Type", "Authorization"],
};
app.use(cors(corsOptions));
app.options("*", cors(corsOptions));

/* ===== Multer (upload local) ===== */
const storage = multer.diskStorage({
  destination: (req, file, cb) => cb(null, path.join(__dirname, "uploads")),
  filename: (req, file, cb) => {
    const ext = path.extname(file.originalname || "");
    const name = `${Date.now()}-${Math.round(Math.random() * 1e9)}${ext}`;
    cb(null, name);
  },
});
const upload = multer({ storage });

/* ===== Parsers & static ===== */
app.use(express.json());
app.use("/uploads", express.static(path.join(__dirname, "uploads")));

/* ===== Root API endpoint ===== */
app.get("/api", (req, res) => {
  res.json({
    message: "Welcome to Group12 API",
    version: "1.0.0",
    endpoints: {
      auth: ["/api/login", "/api/signup", "/api/logout", "/api/auth/refresh"],
      profile: ["/api/profile"],
      admin: ["/api/users", "/api/admin/users"],
      utils: ["/api/health", "/api/forgot-password", "/api/reset-password"]
    }
  });
});

/* ===== Health check ===== */
app.get("/api/health", (req, res) => res.json({ ok: true }));

/* =====================================================
   ========== 1) PROFILE (Hoạt động 2)  =================
   ===================================================== */
let profileStore = {
  name: "Admin",
  email: "admin@mail.com",
  role: "admin", // rất quan trọng để FE guard đọc được
  phone: "0900000000",
  address: "HCM",
};

// GET /api/profile
app.get("/api/profile", (req, res) => {
  return res.json(profileStore);
});

// PUT /api/profile
app.put("/api/profile", (req, res) => {
  const { name, email, phone, address } = req.body || {};
  if (!name || !email) return res.status(400).json({ message: "Thiếu name/email" });
  profileStore = { ...profileStore, name, email, phone: phone || "", address: address || "" };
  return res.json(profileStore);
});

/* Auth with JWT */
app.post("/api/signup", (req, res) => {
  const { name, email, password } = req.body || {};
  if (!name || !email || !password) return res.status(400).json({ message: "Thiếu dữ liệu" });
  
  // Kiểm tra email đã tồn tại chưa
  const existingUser = usersStore.find(u => u.email === email);
  if (existingUser) {
    return res.status(400).json({ message: "Email đã được đăng ký!" });
  }
  
  // Tạo user mới và LƯU VÀO usersStore
  const newUser = {
    _id: `u${usersStore.length + 1}`,
    name,
    email,
    password, // Lưu password để kiểm tra khi login
    role: "user",
    createdAt: new Date().toISOString()
  };
  usersStore.push(newUser);
  
  const user = { email, name, role: "user", userId: newUser._id };
  const accessToken = generateAccessToken(user);
  const refreshToken = generateRefreshToken(user);
  
  profileStore = { ...profileStore, name, email, role: "user" };
  
  console.log(`✅ Đăng ký thành công: ${email}`);
  
  return res.status(201).json({ 
    message: "Đăng ký thành công!",
    accessToken,
    refreshToken,
    user
  });
});

/* =====================================================
   ========== 5) ACTIVITY LOGGING & RATE LIMITING ======
   ===================================================== */
// In-memory activity logs
const activityLogs = [];

// Log activity helper
function logActivity(userId, action, details = {}) {
  const log = {
    id: activityLogs.length + 1,
    userId,
    action,
    details,
    timestamp: new Date().toISOString(),
    ip: details.ip || "unknown"
  };
  activityLogs.push(log);
  console.log(`📝 [LOG] ${userId} - ${action} - ${log.timestamp}`);
  return log;
}

// Rate limiting (in-memory)
const loginAttempts = new Map(); // email -> { count, lastAttempt }

function checkRateLimit(email) {
  const now = Date.now();
  const attempts = loginAttempts.get(email) || { count: 0, lastAttempt: 0 };
  
  // Reset after 15 minutes
  if (now - attempts.lastAttempt > 15 * 60 * 1000) {
    attempts.count = 0;
  }
  
  attempts.count++;
  attempts.lastAttempt = now;
  loginAttempts.set(email, attempts);
  
  // Max 5 attempts per 15 minutes
  if (attempts.count > 5) {
    return { blocked: true, remainingTime: Math.ceil((attempts.lastAttempt + 15 * 60 * 1000 - now) / 1000 / 60) };
  }
  
  return { blocked: false, attempts: attempts.count };
}

app.post("/api/login", (req, res) => {
  const { email, password } = req.body || {};
  if (!email || !password) return res.status(400).json({ message: "Thiếu dữ liệu" });
  
  // Rate limiting check
  const rateLimit = checkRateLimit(email);
  if (rateLimit.blocked) {
    logActivity(email, "LOGIN_BLOCKED", { reason: "Rate limit exceeded", ip: req.ip });
    return res.status(429).json({ 
      message: `Quá nhiều lần đăng nhập thất bại. Vui lòng thử lại sau ${rateLimit.remainingTime} phút.` 
    });
  }
  
  // Kiểm tra tài khoản và mật khẩu
  let user;
  const validPassword = "123456"; // Mật khẩu chung cho tài khoản demo
  
  // 1. Kiểm tra tài khoản demo cố định
  if (email === "admin@example.com" && password === validPassword) {
    user = { email, role: "admin", name: "Admin User", userId: "1" };
  } else if (email === "mod@example.com" && password === validPassword) {
    user = { email, role: "moderator", name: "Moderator User", userId: "2" };
  } else if (email === "user@example.com" && password === validPassword) {
    user = { email, role: "user", name: "Normal User", userId: "3" };
  } else {
    // 2. Kiểm tra tài khoản đã đăng ký trong usersStore
    const registeredUser = usersStore.find(u => u.email === email);
    if (registeredUser && registeredUser.password === password) {
      user = { 
        email: registeredUser.email, 
        role: registeredUser.role || "user", 
        name: registeredUser.name,
        userId: registeredUser._id
      };
    } else {
      // Sai email hoặc password
      console.log(`❌ Đăng nhập thất bại: ${email}`);
      return res.status(401).json({ message: "Email hoặc mật khẩu không đúng!" });
    }
  }
  
  const accessToken = generateAccessToken(user);
  const refreshToken = generateRefreshToken(user);
  
  // Log successful login
  logActivity(user.userId, "LOGIN_SUCCESS", { email, role: user.role, ip: req.ip });
  
  // Reset rate limit on success
  loginAttempts.delete(email);
  
  console.log(`✅ Đăng nhập thành công: ${email} - Role: ${user.role}`);
  
  return res.json({ 
    message: "Đăng nhập thành công!", 
    accessToken,
    refreshToken,
    user
  });
});

// ============ REFRESH TOKEN ENDPOINT (Hoạt động 1 - SV2) ============
app.post("/api/auth/refresh", (req, res) => {
  const { refreshToken } = req.body;
  
  if (!refreshToken) {
    return res.status(401).json({ message: "Refresh token required" });
  }
  
  const userData = verifyRefreshToken(refreshToken);
  if (!userData) {
    return res.status(403).json({ message: "Invalid or expired refresh token" });
  }
  
  // Tạo access token mới
  const newAccessToken = generateAccessToken({
    email: userData.email,
    role: userData.role || "user"
  });
  
  return res.json({
    accessToken: newAccessToken,
    message: "Token refreshed successfully"
  });
});

// ============ LOGOUT - Revoke Refresh Token ============
app.post("/api/logout", (req, res) => {
  const { refreshToken } = req.body;
  if (refreshToken) {
    revokeRefreshToken(refreshToken);
  }
  return res.json({ message: "Logged out successfully" });
});

/* =====================================================
   ========== 2) USERS (Hoạt động 3 – Admin) ============
   ===================================================== */
let usersStore = [
  { _id: "u1", name: "Minh Dũng",  email: "Dungtrinhminh@mail.com",   role: "admin", createdAt: new Date().toISOString() },
  { _id: "u2", name: "Nhật Thiên", email: "ngthanhtoan@mail.com",      role: "user",  createdAt: new Date().toISOString() },
  { _id: "u3", name: "Thanh Toàn", email: "doannnhatthien@mail.com",   role: "user",  createdAt: new Date().toISOString() },
  { _id: "u4", name: "Nhật Thiên", email: "tn6130407@gmail.com", role: "user", createdAt: new Date().toISOString() },
  { _id: "u5", name: "Nhật Thiên", email: "nhatthien@gmail.com", role: "user", password: "123456", createdAt: new Date().toISOString() },
];

// GET /api/users  → danh sách người dùng
app.get("/api/users", (req, res) => {
  // TODO: khi dùng thật, thêm middleware kiểm tra role=admin
  return res.json(usersStore);
});

// DELETE /api/users/:id → xóa 1 user
app.delete("/api/users/:id", (req, res) => {
  const { id } = req.params;
  const before = usersStore.length;
  usersStore = usersStore.filter(u => u._id !== id);
  if (usersStore.length === before) {
    return res.status(404).json({ message: "Không tìm thấy user" });
  }
  return res.json({ ok: true });
});

/* =====================================================
   ========== 3) TÍNH NĂNG NÂNG CAO (Hoạt động 4) ======
   ===================================================== */
// Lưu token reset (demo – in-memory)
const resetTokens = new Map(); // token -> { email, expire }

// POST /api/forgot-password
app.post("/api/forgot-password", (req, res) => {
  const { email } = req.body || {};
  if (!email) return res.status(400).json({ message: "Thiếu email" });

  const user = usersStore.find(u => u.email === email);
  if (!user) {
    // Không tiết lộ thông tin tồn tại hay không
    return res.status(200).json({ message: "Nếu email tồn tại sẽ nhận được hướng dẫn." });
  }

  const token = Math.random().toString(36).slice(2) + Date.now().toString(36);
  resetTokens.set(token, { email, expire: Date.now() + 15 * 60 * 1000 }); // 15 phút

  console.log("[FORGOT] email:", email, "token:", token);
  return res.json({
    message: "Đã tạo token reset (demo). Xem token trong console server.",
    token,
  });
});

// POST /api/reset-password
app.post("/api/reset-password", (req, res) => {
  const { token, password } = req.body || {};
  if (!token || !password) return res.status(400).json({ message: "Thiếu token/mật khẩu" });

  const info = resetTokens.get(token);
  if (!info) return res.status(400).json({ message: "Đổi mật khẩu thành công" });
  if (Date.now() > info.expire) {
    resetTokens.delete(token);
    return res.status(400).json({ message: "Token đã hết hạn" });
  }

  // Cập nhật password demo trong usersStore (nếu có lưu)
  usersStore = usersStore.map(u => (u.email === info.email ? { ...u, password } : u));
  resetTokens.delete(token);
  return res.json({ message: "Đổi mật khẩu thành công (demo)" });
});

// POST /api/upload-avatar  (field name: 'avatar')
app.post("/api/upload-avatar", upload.single("avatar"), (req, res) => {
  if (!req.file) return res.status(400).json({ message: "Không có file" });
  const url = `http://localhost:5000/uploads/${req.file.filename}`;
  
  // Log upload activity
  const userId = req.headers.authorization ? "authenticated-user" : "guest";
  logActivity(userId, "AVATAR_UPLOAD", { filename: req.file.filename, size: req.file.size, ip: req.ip });
  
  return res.json({ url, message: "Upload thành công!" });
});

// GET /api/activity-logs (Admin only)
app.get("/api/activity-logs", (req, res) => {
  // TODO: Add admin authentication middleware
  const { limit = 50, userId, action } = req.query;
  
  let logs = [...activityLogs].reverse(); // Newest first
  
  // Filter by userId
  if (userId) {
    logs = logs.filter(log => log.userId === userId);
  }
  
  // Filter by action
  if (action) {
    logs = logs.filter(log => log.action === action);
  }
  
  // Limit results
  logs = logs.slice(0, parseInt(limit));
  
  return res.json({
    total: activityLogs.length,
    filtered: logs.length,
    logs
  });
});

/* ===== Server ===== */
const PORT = process.env.PORT || 5000;
app.listen(PORT, "127.0.0.1", () => {
  console.log(`Server running on http://127.0.0.1:${PORT}`);
  console.log("Routes available:");
  console.log("- GET/PUT   /api/profile");
  console.log("- POST      /api/login, /api/signup (demo)");
  console.log("- GET       /api/users");
  console.log("- DELETE    /api/users/:id");
  console.log("- POST      /api/forgot-password");
  console.log("- POST      /api/reset-password");
  console.log("- POST      /api/upload-avatar");
});
