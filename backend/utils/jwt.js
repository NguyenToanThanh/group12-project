const jwt = require("jsonwebtoken");

/**
 * Sign JWT Access Token
 * @param {Object} payload - Data to encode (e.g., { id, role })
 * @returns {String} - JWT token
 */
const signAccess = (payload) => {
  return jwt.sign(payload, process.env.JWT_ACCESS_SECRET, {
    expiresIn: process.env.JWT_ACCESS_EXPIRES || "15m",
  });
};

/**
 * Sign JWT Refresh Token
 * @param {Object} payload - Data to encode (e.g., { id })
 * @returns {String} - JWT token
 */
const signRefresh = (payload) => {
  return jwt.sign(payload, process.env.JWT_REFRESH_SECRET, {
    expiresIn: process.env.JWT_REFRESH_EXPIRES || "7d",
  });
};

/**
 * Verify JWT Token
 * @param {String} token - JWT token to verify
 * @param {String} secret - Secret key to verify with
 * @returns {Object} - Decoded payload
 */
const verifyToken = (token, secret) => {
  try {
    return jwt.verify(token, secret);
  } catch (error) {
    throw new Error("Invalid or expired token");
  }
};

module.exports = {
  signAccess,
  signRefresh,
  verifyToken,
};
