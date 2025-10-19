// backend/auth.js - JWT & Refresh Token Logic
const jwt = require('jsonwebtoken');

// Secret keys (trong thực tế nên để trong .env)
const ACCESS_TOKEN_SECRET = 'your-access-token-secret-key-change-this';
const REFRESH_TOKEN_SECRET = 'your-refresh-token-secret-key-change-this';
const ACCESS_TOKEN_EXPIRY = '15m';  // Access token hết hạn sau 15 phút
const REFRESH_TOKEN_EXPIRY = '7d';  // Refresh token hết hạn sau 7 ngày

// Store refresh tokens in memory (trong thực tế dùng database)
const refreshTokens = new Set();

/**
 * Tạo Access Token
 */
function generateAccessToken(user) {
  return jwt.sign(
    { userId: user.id || user.email, email: user.email, role: user.role },
    ACCESS_TOKEN_SECRET,
    { expiresIn: ACCESS_TOKEN_EXPIRY }
  );
}

/**
 * Tạo Refresh Token
 */
function generateRefreshToken(user) {
  const token = jwt.sign(
    { userId: user.id || user.email, email: user.email },
    REFRESH_TOKEN_SECRET,
    { expiresIn: REFRESH_TOKEN_EXPIRY }
  );
  refreshTokens.add(token);  // Lưu vào store
  return token;
}

/**
 * Verify Access Token
 */
function verifyAccessToken(token) {
  try {
    return jwt.verify(token, ACCESS_TOKEN_SECRET);
  } catch (error) {
    return null;
  }
}

/**
 * Verify Refresh Token
 */
function verifyRefreshToken(token) {
  try {
    if (!refreshTokens.has(token)) {
      return null;  // Token không tồn tại trong store
    }
    return jwt.verify(token, REFRESH_TOKEN_SECRET);
  } catch (error) {
    return null;
  }
}

/**
 * Revoke Refresh Token (khi logout)
 */
function revokeRefreshToken(token) {
  refreshTokens.delete(token);
}

/**
 * Middleware xác thực Access Token
 */
function authenticateToken(req, res, next) {
  const authHeader = req.headers['authorization'];
  const token = authHeader && authHeader.split(' ')[1]; // Bearer TOKEN

  if (!token) {
    return res.status(401).json({ message: 'Access token required' });
  }

  const user = verifyAccessToken(token);
  if (!user) {
    return res.status(403).json({ message: 'Invalid or expired token' });
  }

  req.user = user;
  next();
}

module.exports = {
  generateAccessToken,
  generateRefreshToken,
  verifyAccessToken,
  verifyRefreshToken,
  revokeRefreshToken,
  authenticateToken,
};
