const jwt = require("jsonwebtoken");

const signAccess = (payload) =>
  jwt.sign(payload, process.env.JWT_ACCESS_SECRET, {
    expiresIn: process.env.ACCESS_EXPIRES || "15m",
  });

const signRefresh = (payload) =>
  jwt.sign(payload, process.env.JWT_REFRESH_SECRET, {
    expiresIn: process.env.REFRESH_EXPIRES || "7d",
  });

module.exports = { signAccess, signRefresh };
