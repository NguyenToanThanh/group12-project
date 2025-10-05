const rateLimit = require('express-rate-limit');

const loginLimiter = rateLimit({
  windowMs: 1 * 60 * 1000, // 1 phút
  max: 5, // chỉ cho phép 5 lần trong 1 phút
  message: { error: "Too many login attempts, please try again later." },
  standardHeaders: true,
  legacyHeaders: false,
});

module.exports = { loginLimiter };
